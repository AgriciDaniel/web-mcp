// Executes each JS template against a stub document, captures every registered
// tool, and validates the real objects: schema shape, annotation contract, and
// Chrome's character budgets.
//
// Grepping a file proves the string is present. Running it proves the tool is
// actually well formed. This catches what check-templates.sh cannot.
//
// Usage: node scripts/check-tools.mjs   (exit 0 pass, 1 fail)
import { readFileSync } from 'node:fs';

const files = [
  'vanilla-imperative.js',
  'consequential-prepare-confirm.js',
  'untrusted-content.js',
];
const base = new URL('../templates/', import.meta.url).pathname;
let captured = [];

globalThis.document = {
  modelContext: {
    registerTool(tool) { captured.push(tool); return Promise.resolve(); },
  },
  querySelector: () => null,
};
globalThis.window = { addEventListener() {} };
globalThis.location = { origin: 'https://example.test' };
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({}) });
globalThis.console = console;

for (const f of files) {
  captured = [];
  const src = readFileSync(base + f, 'utf8');
  try {
    // 'modelContext' in document is true, so the guarded blocks run
    new Function(src)();
    for (const t of captured) {
      const errs = [];
      if (typeof t.name !== 'string' || !t.name) errs.push('name');
      if (typeof t.description !== 'string' || !t.description) errs.push('description');
      if (typeof t.execute !== 'function') errs.push('execute not a function');
      const s = t.inputSchema;
      if (!s || s.type !== 'object' || typeof s.properties !== 'object') errs.push('inputSchema');
      else {
        for (const [k, v] of Object.entries(s.properties)) {
          if (!v.type) errs.push(`property ${k} missing type`);
          if (!v.description) errs.push(`property ${k} missing description`);
          if (v.description && v.description.length > 150) errs.push(`property ${k} description > 150`);
        }
      }
      const a = t.annotations || {};
      for (const h of ['readOnlyHint', 'untrustedContentHint', 'consequentialHint'])
        if (typeof a[h] !== 'boolean') errs.push(`annotation ${h} not set`);
      if (t.name && t.name.length > 30) errs.push(`name ${t.name.length} chars > 30`);
      if (t.description && t.description.length > 500) errs.push('description > 500');
      if (errs.length) globalThis.__failed = true;
      console.log(errs.length ? `  FAIL ${f} :: ${t.name} :: ${errs.join(', ')}`
                              : `  ok   ${f} :: ${t.name} (${t.description.length} char desc)`);
    }
    if (!captured.length) console.log(`  note ${f} registered nothing`);
  } catch (e) {
    globalThis.__failed = true;
    console.log(`  ERROR ${f} :: ${e.message}`);
  }
}

process.exit(globalThis.__failed ? 1 : 0);
