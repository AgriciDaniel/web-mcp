/**
 * WebMCP in React, using the OFFICIAL Chrome package.
 *
 *   npm i use-webmcp-tool
 *
 * Publisher is GoogleChromeLabs (Chrome DevRel). Its README states it is
 * maintained by Chrome, and it documents the deprecation of
 * navigator.modelContext.
 *
 * DO NOT install `usewebmcp` by mistake. That is a third-party package from
 * the MCP-B project with roughly 3x the weekly downloads. Popularity is not a
 * signal of officialness in this ecosystem.
 * `@webmcp/react` is a different product again, stale since 2025.
 */

import { useCallback, useMemo } from 'react';
import { useWebMcpTool } from 'use-webmcp-tool';

// Keep the schema OUTSIDE the component. A new object identity on every render
// causes registration churn.
const INPUT_SCHEMA = {
  type: 'object',
  properties: {
    orderId: {
      type: 'string',
      description: 'The order reference, for example ORD-10432.',
    },
  },
  required: ['orderId'],
} as const;

export function OrderStatusTool() {
  // Stable identity, or the hook re-registers on every render.
  const execute = useCallback(
    async (
      { orderId }: { orderId: string },
      { signal }: { signal: AbortSignal },
    ) => {
      if (!/^ORD-\d+$/.test(orderId)) {
        return {
          error: 'invalid_parameters',
          field: 'orderId',
          message: 'orderId must look like ORD-10432.',
        };
      }

      const res = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}`,
        { signal },
      );

      if (res.status === 404) {
        // Empty result is a success, not an error.
        return { ok: true, found: false, message: 'No order with that reference.' };
      }
      if (!res.ok) {
        return { error: 'upstream_error', status: res.status };
      }

      const order = await res.json();
      return {
        ok: true,
        found: true,
        status: order.status,
        shippedAt: order.shippedAt ?? null,
        carrier: order.carrier ?? null,
      };
    },
    [],
  );

  const annotations = useMemo(
    () => ({
      readOnlyHint: true,
      untrustedContentHint: false,
      consequentialHint: false,
    }),
    [],
  );

  // Registers on mount, unregisters on unmount. Do not put this in a component
  // that remounts on every render or every route change.
  useWebMcpTool({
    name: 'check_order_status',
    description:
      'Look up the delivery status of an order by its reference. Returns the ' +
      'current status, ship date and carrier.',
    inputSchema: INPUT_SCHEMA,
    annotations,
    execute,
  });

  return null; // registration-only component
}

/**
 * Mount once, high in the tree, on a route that is a real top-level document.
 *
 *   <OrderStatusTool />
 *
 * In Next.js or any SSR framework, document.modelContext does not exist on the
 * server. Mark the component client-only and never register during render.
 */
