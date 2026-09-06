# Scaffold: wiring tools into a real stack

Pre-flight both gates before writing any integration code. Either one disables
WebMCP, and the failure mode is not documented, so assume you will get no useful
error.

## Gate pre-flight

```bash
# 1. Origin isolation. If this header is present with ?0, WebMCP is OFF.
curl -sI https://your-site.example | grep -i 'origin-agent-cluster'
# Expect: nothing, or a value that is not ?0

# 2. Permissions Policy. Default is self, which is fine for top-level.
curl -sI https://your-site.example | grep -i 'permissions-policy'
# If it contains tools=() then WebMCP is deliberately disabled on this page
```

Also grep the codebase for `document.domain`. Any assignment to it disables WebMCP
for that document.

Cross-origin iframe needs BOTH:

```html
<iframe src="https://widget.example" allow="tools"></iframe>
```

```js
document.modelContext.registerTool(tool, {
  exposedTo: ['https://parent-site.example'],
});
```

Cross-origin is deny by default. `exposedTo` is an opt-in allowlist, not a
restriction on an open default.

To disable WebMCP entirely on a sensitive page, send:

```
Permissions-Policy: tools=()
```

Use it on checkout confirmation, account settings, and admin pages where agent
action is never wanted.

## Package identity, before you install anything

At least eight publishers ship packages whose names contain `webmcp`. Popularity is
not a signal of officialness here.

| Stack | Use | Do NOT use |
|---|---|---|
| React | `use-webmcp-tool` (GoogleChromeLabs, Chrome DevRel) | `usewebmcp` is third party with roughly 3x the downloads. `@webmcp/react` is a different product, stale since 2025 |
| Angular | built into `@angular/core` as `experimentalWebMcpTool` | no package to install |
| Vue | `vue-webmcp`, community, Apache-2.0 | none official exists |
| Types | `webmcp-types` (webmachinelearning) | `@mcp-b/webmcp-types` is a different package from a different publisher |
| Vanilla | nothing | `@webmcp/core` is AGPL-3.0 and triggers source disclosure in a proprietary product |

See [ecosystem.md](ecosystem.md) for the full licence boundary.

## Vanilla

No dependency. Register once, at load, on the top-level document.

Template: [`templates/vanilla-imperative.js`](../../../templates/vanilla-imperative.js)

Guard for support so the page still works everywhere:

```js
if ('modelContext' in document) {
  // register
}
```

## React

```bash
npm i use-webmcp-tool
```

The hook registers on mount and unregisters on unmount, which is the correct
lifecycle. Do not register in a component that remounts on every render.

Template: [`templates/react-use-webmcp-tool.tsx`](../../../templates/react-use-webmcp-tool.tsx)

Keep `execute` stable with `useCallback`, and keep the schema object outside the
component or memoised. A new object identity every render causes churn.

## Angular

Built in as of v22.x. No package. The docs state WebMCP support in Angular is
experimental and the APIs are subject to change.

Template: [`templates/angular-signal-form.ts`](../../../templates/angular-signal-form.ts)

Angular can derive a tool from a Signal Form, which is genuinely useful when the
action already exists as a validated form.

## Vue

```bash
npm i vue-webmcp
```

Template: [`templates/vue-composable.js`](../../../templates/vue-composable.js)

## Next.js and any SSR framework

`document.modelContext` does not exist on the server. Registration must be
client-only.

- Register inside an effect, never during render.
- Mark the component with the client directive your framework uses.
- Do not attempt registration during hydration mismatch recovery.
- Confirm the page is a real top-level document, not embedded in a cross-origin
  frame by a preview or embed tool.

## Declarative, only when a client reads it

If the action is already a real `<form>` and the assessment named a client that
reads declarative tools, this is the least code.

Template: [`templates/declarative-form.html`](../../../templates/declarative-form.html)

Remember the documentation for the declarative API is materially staler than the
imperative page, and that removing either `toolname` or `tooldescription`
unregisters the tool.

## After scaffolding

Go to [verify.md](verify.md). Registration succeeding is not evidence that an agent
will pick the tool or fill it correctly.
