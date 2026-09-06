/**
 * WebMCP: the prepare -> confirm pattern for irreversible actions.
 *
 * Never let one tool call spend money, book, cancel, or send.
 *
 * Chrome's wording is that consequentialHint lets "the agent or browser"
 * request confirmation. That means you CANNOT rely on confirmation happening.
 * Splitting the action into two calls puts the gap under the page's control,
 * which is the only place you actually govern.
 *
 * prepare_* is read-only and returns a summary plus a short-lived token.
 * confirm_* executes only when handed that exact token.
 */

if ('modelContext' in document) {
  // Server-issued, single-use, short-lived. Never derive this on the client,
  // and never accept a token the server did not mint.
  const registerPrepare = () =>
    document.modelContext.registerTool({
      name: 'prepare_booking',
      description:
        'Check availability and price for a booking and return a summary for ' +
        'the customer to review. Does not book anything.',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Requested date, YYYY-MM-DD.' },
          partySize: { type: 'integer', description: 'Number of people, 1 to 12.' },
        },
        required: ['date', 'partySize'],
      },
      annotations: {
        readOnlyHint: true,       // genuinely changes nothing
        untrustedContentHint: false,
        consequentialHint: false, // preparing is not consequential
      },
      async execute({ date, partySize }, { signal }) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return {
            error: 'invalid_parameters',
            field: 'date',
            message: 'date must be YYYY-MM-DD.',
          };
        }
        if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
          return {
            error: 'invalid_parameters',
            field: 'partySize',
            message: 'partySize must be an integer between 1 and 12.',
          };
        }

        const res = await fetch('/api/bookings/prepare', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ date, partySize }),
          signal,
        });

        if (res.status === 409) {
          // Wrong state: say what would make it possible.
          const alt = await res.json();
          return {
            error: 'unavailable',
            message: `Nothing available on ${date} for ${partySize}.`,
            nearestAvailable: alt.nearestAvailable ?? null,
          };
        }
        if (!res.ok) {
          return { error: 'upstream_error', status: res.status };
        }

        const { summary, confirmationToken, expiresAt, totalPrice } = await res.json();

        // The summary is what the human reads before confirming.
        return {
          ok: true,
          summary,
          totalPrice,
          confirmationToken,
          expiresAt,
          nextStep:
            'Show this summary to the customer. Call confirm_booking with the ' +
            'confirmationToken only after they agree.',
        };
      },
    });

  const registerConfirm = () =>
    document.modelContext.registerTool({
      name: 'confirm_booking',
      description:
        'Complete a booking that was previously prepared. Requires the ' +
        'confirmationToken returned by prepare_booking. This charges the customer.',
      inputSchema: {
        type: 'object',
        properties: {
          confirmationToken: {
            type: 'string',
            description: 'The token returned by prepare_booking.',
          },
        },
        required: ['confirmationToken'],
      },
      annotations: {
        readOnlyHint: false,      // it mutates
        untrustedContentHint: false,
        consequentialHint: true,  // REQUIRED: real-world, non-reversible, charges money
      },
      async execute({ confirmationToken }, { signal }) {
        if (typeof confirmationToken !== 'string' || !confirmationToken) {
          return {
            error: 'invalid_parameters',
            field: 'confirmationToken',
            message: 'Call prepare_booking first and pass its confirmationToken.',
          };
        }

        // The page owns the human gate. Do not delegate this to the agent.
        const approved = await showConfirmationDialog(confirmationToken);
        if (!approved) {
          // Business-logic violation, stated in the user's terms.
          return {
            error: 'declined_by_user',
            message: 'The customer did not confirm. Nothing was booked or charged.',
          };
        }

        const res = await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ confirmationToken }),
          signal,
        });

        if (res.status === 410) {
          return {
            error: 'token_expired',
            message: 'The quote expired. Call prepare_booking again.',
          };
        }
        if (!res.ok) {
          // NEVER return a cheerful success on failure. The named trap is a tool
          // that silently fails while the surrounding flow still reports success.
          return { error: 'booking_failed', status: res.status };
        }

        const { bookingId } = await res.json();
        return { ok: true, bookingId, message: 'Booking confirmed.' };
      },
    });

  Promise.all([registerPrepare(), registerConfirm()]).catch((err) =>
    console.error('[webmcp] registration failed:', err.name, err.message),
  );
}

/** Page-owned confirmation UI. Replace with your real dialog. */
async function showConfirmationDialog(/* token */) {
  throw new Error('Implement a page-owned confirmation dialog.');
}
