# WebMCP API reference, verified

Every signature below was verified against the spec and Chrome documentation on
2026-09-05. The spec is a moving target. Re-verify before relying on this after
2026-12-01.

## The two silent-failure gates

Check these FIRST when a tool does not appear. Both disable the API with no visible
error. Verbatim from developer.chrome.com/docs/ai/webmcp, updated 2026-08-07:

> "WebMCP is only available in origin-isolated documents. This ensures that the
> document's origin remains stable throughout the tool's lifetime."

> "If a document has `document.domain` enabled (for example, by using the
> `Origin-Agent-Cluster: ?0` HTTP header), WebMCP APIs are disabled."

> "Both APIs are gated by the `tools` Permissions Policy. The policy defaults to
> `self`, which allows tool registration in top-level and same-origin contexts, and
> disables it for cross-origin iframes."

> "To allow WebMCP tools in a cross-origin iframe, add the `allow="tools"`
> attribute to the iframe."

A cross-origin iframe additionally needs the tool registered with
`exposedTo: ['https://parent-origin']`. Cross-origin is DENY by default, so
`exposedTo` is an opt-in allowlist rather than a restriction on an open default.

There is also an explicit kill switch: `Permissions-Policy: tools=()` disables
WebMCP entirely on a page. Use it on checkout, account and admin pages where agent
action is never wanted.

The failure MODE of these gates is not documented. Neither Chrome nor the spec
states whether they throw, leave the attribute undefined, or fail quietly. Assume no
useful error and verify directly.

## Entry point

`document.modelContext`. NOT `navigator.modelContext`.

The API moved from `Navigator` to `Document` in spec PR #184, merged 2026-05-27,
closing issue #173. The current spec IDL defines the getter only on `Document`.
Tutorials and packages still using `navigator.modelContext` predate this move.

## Imperative API, verbatim WebIDL

```webidl
partial interface Document {
  [SecureContext, SameObject] readonly attribute ModelContext modelContext;
};

[Exposed=Window, SecureContext]
interface ModelContext : EventTarget {
  Promise<undefined> registerTool(ModelContextTool tool, optional ModelContextRegisterToolOptions options = {});
  Promise<sequence<RegisteredTool>> getTools(optional ModelContextGetToolOptions options = {});
  Promise<DOMString> executeTool(RegisteredTool tool, optional object inputObject = {}, optional ModelContextExecuteToolOptions options = {});
  attribute EventHandler ontoolchange;
};

dictionary ModelContextTool {
  required DOMString name;
  USVString title;
  required DOMString description;
  object inputSchema;
  required ToolExecuteCallback execute;
  ToolAnnotations annotations;
};

dictionary ToolAnnotations {
  boolean readOnlyHint = false;
  boolean untrustedContentHint = false;
  boolean consequentialHint = false;
};

dictionary ToolExecuteCallbackOptions {
  required AbortSignal signal;
};

callback ToolExecuteCallback = Promise<any> (object inputObject, ToolExecuteCallbackOptions options);

dictionary ModelContextRegisterToolOptions {
  sequence<USVString> exposedTo;
  AbortSignal signal;
};
```

The two options dictionaries referenced above, added 2026-09-06 after an audit found
them missing:

```webidl
dictionary ModelContextGetToolOptions {
  sequence<USVString> fromOrigins;
};

dictionary ModelContextExecuteToolOptions {
  AbortSignal signal;
};
```

`ontoolchange` fires a plain `Event`. There is no `ToolChangeEvent` interface and no
event detail. Do not expect a payload.

`inputSchema` uses JSON Schema draft 2020-12. No documented subset restriction was
found.

## registerTool exception behaviour

Added 2026-09-06. `registerTool` rejects with an `InvalidStateError` `DOMException`
when:

- a tool with that name is already registered;
- `name` or `description` is the empty string;
- `name` exceeds 128 characters, or contains a code point outside ASCII
  alphanumeric, underscore, hyphen or period.

This is what makes tool-name collisions fail loudly rather than silently
overwriting. It is a baseline security property, not an ergonomic detail.

There is NO bulk registration API. `provideContext()` existed historically and was
removed for security: issue #101, opened 2026-02-20, found it silently cleared
previously registered tools, creating a tool-hijack vector. Per-tool registration
is a security property, not an ergonomic gap. Do not reintroduce a wrapper that
restores bulk-replace semantics.

Unregistration is via the `signal` in `ModelContextRegisterToolOptions`, then
`controller.abort()`. As of Chrome 153 a tool can be unregistered without
cancelling in-flight executions. That statement is specific to registration
signals, not to all abort calls.

## The annotation contract

This is the safety surface. Set all three deliberately on every tool.

| Annotation | Normative meaning, verbatim |
|---|---|
| `readOnlyHint` | "If true, indicates that the tool does not modify any state and only reads data" |
| `untrustedContentHint` | "If true, indicates that the tool's output contains data that is untrusted" |
| `consequentialHint` | "If true, indicates that executing the tool will result in consequential actions that are significant, real-world, or non-reversible, ex: booking a flight, transferring money" |

`consequentialHint` was added 2026-09-03 and is the newest part of the surface.

MCP proper's `destructiveHint`, `idempotentHint`, and `openWorldHint` do NOT exist
in WebMCP. Zero matches in the spec.

Chrome publishes character budgets on the secure-tools page, framed as security
controls limiting prompt-injection and exfiltration payload size, not as style
guidance: tool description 500 characters, parameter description 150, tool name 30,
individual tool output 1.5K. Note the name budget of 30 is guidance while the
128-character `InvalidStateError` limit above is enforcement.

Review rule: any tool that spends money, books, cancels, sends a message, or
changes an account MUST set `consequentialHint: true`. Any tool returning user
generated content, reviews, or third-party text MUST set
`untrustedContentHint: true`. Treat a missing annotation as a finding, not a
default.

## Declarative API, verbatim

From developer.chrome.com/docs/ai/webmcp/declarative-api, page updated 2026-05-18.
Note this page is roughly 3.5 months staler than the imperative page.

```html
<form toolname="supportRequestTool"
      tooldescription="Submit a request for support."
      action="/submit">
    <label for="firstName">First Name</label>
    <input type=text name=firstName>
    <select name="select" required
      toolparamdescription="Determines what team this request is routed to.">
      <option value="Customer happiness team">Return my purchase.</option>
    </select>
    <button type=submit>Submit</button>
</form>
```

Attributes are lowercase, unhyphenated, and NOT `data-` prefixed: `toolname`,
`tooldescription`, `toolparamdescription`, `toolautosubmit`.

Removal rule, verbatim: "If you remove either the `toolname` or `tooldescription`
HTML attribute, the tool is unregistered."

Parameter description fallback: the `toolparamdescription` attribute, then the
associated `<label>` text, then `aria-description`. Only add
`toolparamdescription` where the label is genuinely ambiguous.

`toolautosubmit` triggers "submission and a navigation when the model invokes this
tool". An earlier version of this reference omitted the navigation. Corrected
2026-09-06.

CLIENT CAVEAT: ChatGPT's Site tools, the only shipping client that can call tools
today, discovers ONLY imperative tools on the top-level page. It does not see
declarative form tools and does not see iframe-registered tools. A declarative tool
is elegant and currently invisible to the only available consumer.

Events: `agentInvoked` is a boolean property on `SubmitEvent`.
`respondWith(Promise<any>)` is a method on `SubmitEvent`, used after
`preventDefault()`. `toolactivated` and `toolcancel` both fire on `window` and
carry a `toolName` property.

CSS: `:tool-form-active` applies to the `<form>`, `:tool-submit-active` to the
submit control. Use them so a person can see what an agent is touching.

## Chrome's own design rules, quoted

Added 2026-09-06 from the best-practices and build-tools pages.

- "Each tool should consist of a single function."
- Static registration is the default. Use dynamic registration only when
  availability must genuinely change.
- Anti-pattern: negative descriptions such as "Don't use this tool for weather".
  Write positive capability statements.
- "Validate strictly in code, loosely in schema."
- Anti-pattern: writing narrow rules to patch one model's behaviour instead of
  fixing the tool.
- Goal definition must answer "What are the boundaries? Define what the agent
  should not do."
- Four named error patterns: wrong state, invalid parameters, empty result,
  business-logic violation. "avoid returning generic error messages, raw API
  errors, or failing silently."
- Evals are living artifacts: "analyze your interaction logs... use those insights
  to continuously update your evals and tool definitions."

Chrome's evals page names five failure modes worth testing against: wrong tool
selection, wrong order, incorrect arguments, wrong output, runtime failures. It
provides a deterministic assertion shape, `expectedCall`, and states "You should
continue to write classic deterministic tests for any system interaction that
doesn't communicate with the model." It names a false-positive trap worth carrying
into any measurement plan: a coupon tool that silently fails while checkout still
reports success.

## Tool design review checks

1. Does the description read as an instruction to a competent stranger. A badly
   worded description is the most common failure, ahead of any code defect.
2. Is the tool single-purpose. Three or four sharp tools on one high-value flow
   beat instrumenting a whole site.
3. Are all three annotations set deliberately.
4. Does `execute` pass `signal` through to every `fetch` it makes.
5. Is any returned third-party text marked `untrustedContentHint` and sanitised
   before it reaches a model.
6. Does the tool assume the visitor's own authenticated session, and does it
   therefore inherit exactly that visitor's authorisation and no more.
7. For a cross-origin iframe, are BOTH `allow="tools"` and `exposedTo` set.

## Official testing surfaces, all shipped

| Surface | What it does |
|---|---|
| Chrome DevTools WebMCP panel, Application tab | Tool inspection, invocation history and timeline, manual test-invoke, schema-violation errors |
| Lighthouse Agentic Browsing category | Deterministic audits. Requires Chrome 150 or later. WebMCP audits require origin trial registration. Explicitly experimental. Calls the CDP `WebMCP` domain to monitor registration, verifying both declarative and imperative tools. Also checks accessibility tree integrity, CLS, and llms.txt. Reports a pass/fail ratio, NOT a 0 to 100 score |
| webmcp-evals CLI | Tests LLM tool-calling accuracy against defined schemas and cases |
| Model Context Tool Inspector extension | Lists and fires tools, Gemini integration. By Francois Beaufort, Google Ireland. Its own listing says "not an officially supported Google product" |

Do not convert a Lighthouse pass/fail fraction into a fabricated universal score.
Retain the exact score representation, fraction, raw audit IDs, exclusions, and
complete, partial, or unavailable state.

## Local development

`chrome://flags/#enable-webmcp-testing`, UI label "WebMCP for testing". Flag name
confirmed unchanged as of 2026-09-04.

The two version figures are not a contradiction, resolved 2026-09-06. The flag
first shipped at 146.0.7672.0. The Model Context Tool Inspector extension pins
150.0.7861.0 as its own floor, most plausibly because the API changed substantially
between March and August 2026, when several merged spec pull requests reworked
`executeTool()`, `inputSchema` typing and execution semantics. That reasoning is
inference; no primary source states it.

Production during the trial requires an origin trial token served as an
`Origin-Trial` header or meta tag. Chrome trial ID 4163014905550602241, versions
149 to 156.

End date, resolved 2026-09-06: 2026-11-17. Microsoft Edge's origin trials console
shows that date for the WebMCP trial, and Edge shares the same Chromium
origin-trial token infrastructure. Corroborated by milestone data, M156 stable
2026-10-20 and M157 stable 2026-11-03, placing 2026-11-17 about two weeks after
M157, consistent with Chrome's usual grace period.

CAVEAT: this is Microsoft's console, not Google's. Chrome's own chromestatus and
origintrials pages remain JavaScript applications that return empty to direct
fetches. Treat as moderate-high confidence from a sibling surface, not a Google
primary source.

Enrolling in a trial, setting a flag, installing an extension, or running a CLI are
all owner actions requiring explicit authorisation. This Skill does not perform
them.
