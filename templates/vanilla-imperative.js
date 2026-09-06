/**
 * WebMCP: vanilla imperative tool registration.
 *
 * Copy, rename, replace the body of execute. No dependencies.
 * Register once, at load, on the top-level document.
 *
 * Entry point is document.modelContext. NOT navigator.modelContext,
 * which was superseded on 2026-05-27 and dates any code that uses it.
 */

// Guard so the page works everywhere. WebMCP is not on by default in any browser.
if ('modelContext' in document) {
  const controller = new AbortController();

  document.modelContext.registerTool(
    {
      // <= 30 chars guidance, 128 hard limit. ASCII alnum, _ - . only.
      // Verb first, noun second. Duplicate names throw InvalidStateError.
      name: 'search_products',

      // <= 500 chars. Positive capability statement.
      // Never "Don't use this for X" - the model reads capability, not rules.
      description:
        'Search the product catalogue by keyword and optional category. ' +
        'Returns up to 10 matches with name, price and availability.',

      // JSON Schema draft 2020-12.
      // Loose here, strict in code. Let the model attempt the call.
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            // <= 150 chars per parameter description.
            description: 'Free-text search terms, for example "wool runner".',
          },
          category: {
            type: 'string',
            enum: ['shoes', 'apparel', 'accessories'],
            description: 'Optional category filter.',
          },
        },
        required: ['query'],
      },

      // All three set deliberately. Two of the three default permissively,
      // so leaving them unset is an active claim, not a neutral gap.
      annotations: {
        readOnlyHint: true,          // genuinely mutates nothing
        untrustedContentHint: false, // first-party catalogue copy only
        consequentialHint: false,    // nothing irreversible
      },

      // Second arg carries a required AbortSignal. Thread it into every fetch.
      async execute({ query, category }, { signal }) {
        // Strict validation in code, even though the schema was loose.
        if (typeof query !== 'string' || query.trim().length === 0) {
          // Invalid parameters: name the field, the problem, and what is accepted.
          return {
            error: 'invalid_parameters',
            field: 'query',
            message: 'query must be a non-empty string.',
          };
        }

        const url = new URL('/api/products', location.origin);
        url.searchParams.set('q', query.trim());
        if (category) url.searchParams.set('category', category);

        let response;
        try {
          response = await fetch(url, { signal });
        } catch (err) {
          if (err.name === 'AbortError') throw err; // let cancellation propagate
          // Wrong state: say what happened and what would make it work.
          return {
            error: 'upstream_unavailable',
            message: 'The catalogue service did not respond. Retry shortly.',
          };
        }

        if (!response.ok) {
          return {
            error: 'upstream_error',
            status: response.status,
            message: 'The catalogue service returned an error.',
          };
        }

        const data = await response.json();

        // Empty result is a SUCCESS, not an error. Say so explicitly,
        // or the agent will report a failure that did not happen.
        if (data.items.length === 0) {
          return { ok: true, count: 0, items: [], message: 'No products matched.' };
        }

        // Cap output. Budget is 1.5K characters per tool output.
        // An unbounded list is both a budget overrun and an exfiltration surface.
        return {
          ok: true,
          count: data.items.length,
          items: data.items.slice(0, 10).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            inStock: p.inStock,
          })),
        };
      },
    },
    // Pass the signal to make the tool unregisterable: controller.abort().
    { signal: controller.signal },
  ).catch((err) => {
    // registerTool rejects with InvalidStateError on: duplicate name,
    // empty name or description, name > 128 chars, or an illegal character.
    console.error('[webmcp] registration failed:', err.name, err.message);
  });

  // To unregister later: controller.abort();
  // As of Chrome 153 this does not cancel in-flight executions.
}
