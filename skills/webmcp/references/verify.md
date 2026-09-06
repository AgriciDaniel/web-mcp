# Verify: proving the tools actually work

A tool that registers is not a tool that works. The common failure is not a crash,
it is an agent that never picks the tool, or picks it and fills it wrong, and
nothing anywhere reports an error.

## Order of checks

1. Does it register at all. DevTools.
2. Does it execute correctly when invoked by hand. DevTools.
3. Does a model choose it from natural language. Evals.
4. Does the page still pass structural checks. Lighthouse.

## 1 and 2: Chrome DevTools WebMCP panel

Shipped in the Application tab. This is the primary official surface.

It lists registered tools, shows an invocation history and timeline, lets you
invoke a tool manually with JSON input, and reports schema violations.

If a tool does not appear:

| Symptom | Check |
|---|---|
| No tools at all | Both gates. `Origin-Agent-Cluster: ?0`, `document.domain`, `Permissions-Policy: tools=()` |
| Tool missing, others present | `InvalidStateError` on registration. Duplicate name, empty name or description, name over 128 characters, or a character outside ASCII alphanumeric, underscore, hyphen, period |
| Appears then vanishes | An `AbortSignal` fired, or a component unmounted |
| Present in dev, absent in prod | Origin trial token missing or expired. See [trial.md](trial.md) |
| Only in the parent, not the iframe | Missing `allow="tools"` on the iframe, or missing `exposedTo` at registration |

Do not debug `execute` until the tool appears. The gates fail before your code runs.

## 3: evals, the check that actually matters

Chrome ships a `webmcp-evals` CLI and states plainly that a badly worded
description is the usual failure, ahead of any code defect.

Write cases with a deterministic assertion shape:

```json
{
  "messages": [{ "role": "user", "content": "I want a small pizza" }],
  "expectedCall": [
    { "functionName": "set_pizza_size", "arguments": { "size": "Small" } }
  ]
}
```

Chrome names five failure modes. Test for each:

| Failure | Looks like | Usual cause |
|---|---|---|
| Wrong tool selection | Model calls `cancel_booking` for a reschedule | Overlapping or vague descriptions |
| Wrong order | Confirms before preparing | No stated precondition in the description |
| Incorrect arguments | Sends a display label instead of an ID | Parameter description missing or ambiguous |
| Wrong output | Agent reports something the tool did not return | Output shape undocumented, or output over budget and truncated |
| Runtime failure | Throws, hangs, or never resolves | `signal` not threaded, unhandled rejection |

Chrome also states you should keep writing ordinary deterministic tests for any
system interaction that does not talk to the model. Evals are additive, not a
replacement.

Treat evals as a living artifact. Chrome's guidance is to analyse interaction logs
and use them to update evals and tool definitions continuously.

## The silent-failure trap

Chrome's own named example: a coupon tool that silently fails while checkout still
reports success. The agent reports success. The user believes it. Nobody finds out
until the invoice.

Write at least one eval per consequential tool that asserts the FAILURE path
returns a structured error, not a cheerful success.

## 4: Lighthouse Agentic Browsing

A real, shipped audit category. Requires Chrome 150 or later, and its WebMCP audits
require origin trial registration. It is explicitly experimental and based on
proposed standards.

It calls the Chrome DevTools Protocol `WebMCP` domain to monitor tool registration
events, and verifies both declarative and imperative tools. It also checks
accessibility tree integrity, CLS, and llms.txt discoverability.

It reports a PASS AND FAIL RATIO, not a 0 to 100 score. Do not convert the fraction
into a score. Retain the exact representation, the raw audit IDs, exclusions, and
the complete, partial or unavailable state.

An absent llms.txt is an opportunity for a relevant use case, not an accessibility
or ranking failure.

## What you still cannot measure

No browser telemetry, analytics vendor or standard exposes tool invocation
externally. If you want to know whether a real agent ever called your tool, you
must instrument your own `execute` handlers and log it yourself.

A usable measurement plan states what each handler logs, how an agent invocation is
distinguished from a human submission, what the pre-launch baseline was, and that
the resulting numbers are not comparable to any other site's.

Plan for the instrumentation recording nothing for a long time. The one verifiable
public deployment logged zero external agent calls in its first 93 days. Decide in
advance what a quiet log would mean before you read it as failure.

## Sign-off

- [ ] Every tool appears in the DevTools panel
- [ ] Every tool executes correctly when invoked by hand
- [ ] An eval exists per tool for correct selection and correct arguments
- [ ] An eval exists per consequential tool for the failure path
- [ ] Lighthouse Agentic Browsing run recorded with its exact fraction and version
- [ ] `execute` handlers log invocations
- [ ] Gates re-checked on the production origin, not just locally
