/**
 * WebMCP in Vue.
 *
 *   npm i vue-webmcp        (community, Apache-2.0)
 *
 * There is no official Vue package. The Vue core team has not shipped WebMCP
 * support, unlike Angular which has it built in. Treat this as community
 * tooling and check its licence before adopting.
 *
 * The plain-composable version below has no dependency and works anywhere.
 */

import { onMounted, onUnmounted } from 'vue';

/**
 * Registers a WebMCP tool for the lifetime of the component.
 * No dependency. Uses document.modelContext directly.
 */
export function useWebMcpTool(tool) {
  let controller;

  onMounted(() => {
    if (!('modelContext' in document)) return;
    controller = new AbortController();
    document.modelContext
      .registerTool(tool, { signal: controller.signal })
      .catch((err) =>
        console.error('[webmcp] registration failed:', err.name, err.message),
      );
  });

  onUnmounted(() => controller?.abort());
}

/* ---- usage ---- */

export default {
  setup() {
    useWebMcpTool({
      name: 'get_quote',
      description:
        'Calculate a delivery quote for a postcode and parcel weight. Returns ' +
        'price and estimated days.',
      inputSchema: {
        type: 'object',
        properties: {
          postcode: { type: 'string', description: 'Destination postcode.' },
          weightKg: { type: 'number', description: 'Parcel weight in kilograms.' },
        },
        required: ['postcode', 'weightKg'],
      },
      annotations: {
        readOnlyHint: true,
        untrustedContentHint: false,
        consequentialHint: false,
      },
      async execute({ postcode, weightKg }, { signal }) {
        if (!postcode || typeof postcode !== 'string') {
          return {
            error: 'invalid_parameters',
            field: 'postcode',
            message: 'postcode is required.',
          };
        }
        if (!(weightKg > 0)) {
          return {
            error: 'invalid_parameters',
            field: 'weightKg',
            message: 'weightKg must be greater than 0.',
          };
        }

        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ postcode, weightKg }),
          signal,
        });
        if (!res.ok) return { error: 'upstream_error', status: res.status };

        const { price, currency, estimatedDays } = await res.json();
        return { ok: true, price, currency, estimatedDays };
      },
    });
  },
};
