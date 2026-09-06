# Implement: turning an assessed flow into working tools

Read this after `assess` returns a build verdict. Building before the fit
assessment passes is how people waste a week on a site that should not have tools.

Every rule here derives from [api-reference.md](api-reference.md). If the two
disagree, the API reference wins and this file is stale.

## Imperative first, and here is why

Default to `document.modelContext.registerTool` on the top-level page.

ChatGPT's Site tools is the only shipping client that can call tools today, and it
discovers ONLY imperative tools on the top-level document. It does not see
declarative form tools. It does not see tools registered inside iframes.

A declarative tool on an existing `<form>` is cheaper and more elegant, and right
now no available client will call it. Choose declarative only when the assessment
names a client that reads declarative tools, or when the build is a deliberate bet
on future coverage. Record which it is.

## Chrome's authoring rules, applied

| Rule | What it means when you write the tool |
|---|---|
| "Each tool should consist of a single function" | One tool, one action. `manage_booking` is a smell. `create_booking`, `cancel_booking` are two tools |
| Static registration is the default | Register at load. Use dynamic registration only when availability genuinely changes, for example a tool that exists only while signed in |
| No negative descriptions | Never "Don't use this for weather". Write what the tool does, not what it is not for. The model reads a capability statement, not a rulebook |
| "Validate strictly in code, loosely in schema" | Keep `inputSchema` permissive enough that the model can attempt the call. Reject bad input inside `execute` with a specific error |
| Do not patch one model's behaviour | If a model picks the wrong tool, fix the name and description. Do not add "only use this if the user said X" |

## Budgets are authoring constraints, not style advice

Chrome publishes these on the secure-tools page as controls that limit
prompt-injection and exfiltration payload size.

| Field | Budget |
|---|---|
| Tool name | 30 characters |
| Tool description | 500 characters |
| Parameter description | 150 characters |
| Individual tool output | 1.5K characters |

Separately, `registerTool` REJECTS with `InvalidStateError` when the name exceeds
128 characters, when name or description is empty, when the name contains a code
point outside ASCII alphanumeric, underscore, hyphen or period, or when a tool with
that name is already registered.

30 is the guidance. 128 is the wall. Write to 30.

## Naming so tools do not collide

Duplicate names throw. That is a feature, since it means a collision fails loudly
rather than silently replacing someone else's tool.

Use a stable, deterministic name derived from the domain and the action, lowercase
with underscores, no dots unless you are deliberately namespacing:

```
search_products        create_booking        cancel_booking
check_order_status     get_quote             apply_coupon
```

Verb first, noun second. A person reading only the name should be able to guess the
inputs. If two teams own tools on the same page, agree a prefix before shipping,
not after the exception.

## The annotation contract

Set all three deliberately on every tool. Two of the three default in the
permissive direction, so silence is a claim.

| Annotation | Default | What the default asserts |
|---|---|---|
| `readOnlyHint` | `false` | Presumed to change state. Cautious. Safe to leave unset |
| `untrustedContentHint` | `false` | Output presumed TRUSTED. Permissive. Dangerous to leave unset |
| `consequentialHint` | `false` | Action presumed NON-consequential. Permissive. Dangerous to leave unset |

Rules:

- Anything that spends, books, cancels, sends, or changes an account sets
  `consequentialHint: true`.
- Anything returning user-generated content, reviews, third-party text, or scraped
  data sets `untrustedContentHint: true`.
- Only set `readOnlyHint: true` when the tool genuinely mutates nothing. A read that
  writes an analytics row is not read-only.

## Structured errors, always

Chrome names four error patterns. Return the one that fits, with enough detail for
the agent to recover, and never a generic message, a raw API error, or a silent
failure.

| Pattern | When | Return |
|---|---|---|
| Wrong state | The action is impossible right now | What state the system is in, and what would make it possible |
| Invalid parameters | Input failed your strict code-side validation | Which field, what was wrong, what is accepted |
| Empty result | The operation succeeded and matched nothing | That it succeeded, and that zero matched. Not an error |
| Business-logic violation | A rule forbids it | Which rule, in the user's terms |

The trap worth naming: a tool that silently fails while the surrounding flow still
reports success. Chrome's own example is a coupon tool that does nothing while
checkout still completes. The agent reports success, the user believes it, and
nobody finds out until the invoice.

## Irreversible actions: prepare then confirm

Do not let a single tool call spend money or make a booking.

Split it into two tools. The first prepares and returns a summary plus an opaque
token. The second executes only when handed that token. The person sees the summary
between the two calls.

```
prepare_booking(...)  ->  { summary, confirmation_ref, expires_at }
confirm_booking({ confirmation_ref })  ->  { booking_id }
```

`prepare_*` is `readOnlyHint: true`. `confirm_*` is `consequentialHint: true`.

This holds regardless of what the agent or browser does, because the page owns the
gap between the two calls. Chrome's own wording permits the agent or browser to
request confirmation, which means you cannot rely on it happening. See
[claims-and-maturity.md](claims-and-maturity.md).

## Tool output is a prompt-injection surface

`untrustedContentHint` is a declaration to the agent. It is not a sanitiser. The
page still owns sanitising anything a third party authored before returning it.

Chrome's agent-security writing names Base64 "spotlighting" of untrusted content
with a stated tradeoff of roughly a 33 percent token increase, plus classifier and
LLM-critic verification passes.

Cap output at the 1.5K budget. A tool that returns an unbounded list is an
exfiltration surface and will blow the budget anyway.

## Sessions inherit exactly the visitor's authority

A tool runs in the visitor's own authenticated session. That is what makes WebMCP
useful and what makes it dangerous.

The question is never "can the visitor do this". It is "should an agent be able to
do this unattended, at speed, without the visitor having formed the intent for this
specific instance".

The spec also names extended user context, including personalization data, browsing
history and payment information, and cross-site context where an agent correlates
across origins. A tool returning more than it needs feeds a profile you do not
control.

## Checklist before you move to scaffold

1. One action per tool.
2. Name under 30 characters, verb first, deterministic.
3. Description states capability positively, under 500 characters.
4. Every parameter described, under 150 characters each.
5. All three annotations set deliberately.
6. `signal` accepted and threaded into every `fetch`.
7. Output capped, and untrusted content marked and sanitised.
8. Errors structured into the four patterns.
9. Anything irreversible split into prepare and confirm.
10. No `navigator.modelContext` anywhere.

Then go to [scaffold.md](scaffold.md), then [verify.md](verify.md).
