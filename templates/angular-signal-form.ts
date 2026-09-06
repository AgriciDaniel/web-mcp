/**
 * WebMCP in Angular.
 *
 * NOTHING TO INSTALL. Support is built into @angular/core as of v22.x.
 * Angular's own docs state: "WebMCP support in Angular is currently
 * experimental. APIs are subject to change."
 *
 * Angular's core-team implementer wrote in the pull request that added it:
 * "The spec is not fully fleshed out... I mostly backwards engineered Chrome's
 * existing implementation." Treat the integration accordingly.
 */

import { Component, signal } from '@angular/core';
import { experimentalWebMcpTool } from '@angular/core';

@Component({
  selector: 'app-support-tool',
  standalone: true,
  template: '',
})
export class SupportToolComponent {
  private readonly lastTicketId = signal<string | null>(null);

  // Registered for the lifetime of the component.
  readonly createTicket = experimentalWebMcpTool({
    name: 'create_ticket',
    description:
      'Open a support ticket with a subject, description and routing team. ' +
      'Returns the ticket reference.',
    inputSchema: {
      type: 'object',
      properties: {
        subject: {
          type: 'string',
          description: 'One-line summary of the issue.',
        },
        body: {
          type: 'string',
          description: 'Full description of the problem.',
        },
        team: {
          type: 'string',
          enum: ['billing', 'delivery', 'technical'],
          description: 'Which team should receive this.',
        },
      },
      required: ['subject', 'body', 'team'],
    },
    annotations: {
      readOnlyHint: false,      // creates a record
      untrustedContentHint: false,
      // Creating a ticket is real-world but reversible and low-stakes.
      // Set true for anything that charges, books, cancels, or sends externally.
      consequentialHint: false,
    },
    execute: async (
      { subject, body, team }: { subject: string; body: string; team: string },
      { signal }: { signal: AbortSignal },
    ) => {
      if (!subject?.trim()) {
        return {
          error: 'invalid_parameters',
          field: 'subject',
          message: 'subject must not be empty.',
        };
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, body, team }),
        signal,
      });

      if (!res.ok) {
        return { error: 'upstream_error', status: res.status };
      }

      const { ticketId } = await res.json();
      this.lastTicketId.set(ticketId);
      return { ok: true, ticketId };
    },
  });
}

/**
 * Signal Forms.
 *
 * Angular can derive a tool from an existing Signal Form, which is worth using
 * when the action already exists as a validated form: the field validators become
 * the schema, so the two cannot drift apart.
 *
 * Check the current angular.dev/ai/webmcp page for the exact API before relying
 * on it. It is experimental and the page moves.
 */
