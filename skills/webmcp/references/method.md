# WebMCP readiness assessment: complete method

Authored locally 2026-09-05 from primary sources. No provider repository exists.

## Scope

This method decides three things: whether a site should build WebMCP tools, how
those tools should be shaped if it does, and what may honestly be claimed about the
result. It does not implement, enrol, install, or deploy anything.

## Step 0, bind the maturity boundary

Before assessing anything, read
[claims and maturity](claims-and-maturity.md) and write the maturity statement into
the output. An assessment that buries the pre-standard, origin-trial, near-zero
adoption position in a closing caveat has failed, because the reader will act on
the recommendation and not the caveat.

## Step 1, separate the four questions

Establish which question the requester is actually asking. WebMCP answers only
"can agents act on this site". If the real question is reach, citability, or
ranking, stop and route. Record the routing rather than answering out of scope.

A request phrased as "make my site AI-ready" is almost always at least two
questions. Split them explicitly.

## Step 2, fit assessment

A site earns WebMCP work only when all four hold. Record each with evidence.

| Test | Passes when | Fails when |
|---|---|---|
| Real actions | Visitors take bounded, valuable, repeatable actions: booking, filtering, quoting, checking status, configuring | The site is brochure or article content where reading is the whole job |
| Action value | A completed action is worth materially more than a page view | Actions are incidental or unmonetised |
| Reachable agent | A named agent surface that can call tools today has a plausible reason to be on the page | The intended consumer is not live, or would never arrive |
| Capacity to maintain | The team can own an experimental API that changed twice in the last quarter | No one can re-verify quarterly |

Three or four passes is a build recommendation, scoped small. Two is a defer with a
named re-check date. Fewer is a no, stated plainly.

A fit failure is a legitimate and common outcome. Do not manufacture a build
recommendation from a content site because the requester is enthusiastic.

## Step 3, scope the tool set

If building, select three or four single-purpose tools on ONE high-value flow.
Chrome's own guidance and the adoption evidence both point away from instrumenting
a whole site.

For each proposed tool record: the action, the visitor intent it serves, the inputs
and their types, what a successful result returns, the three annotations with
justification, and whether it is read-only or consequential.

Choosing the form. Corrected 2026-09-06 after client-coverage evidence.

The obvious advice, prefer declarative when the action is already a real `<form>`,
is currently wrong in practice. ChatGPT's Site tools, the only shipping client that
can call tools today, discovers ONLY imperative tools on the top-level page. It
does not see declarative form tools and does not see iframe-registered tools.

So default to imperative registration on the top-level page, because it is the only
form with a demonstrated consumer. Choose declarative when the action is already a
real form AND the assessment has named a client that reads declarative tools, or
when the build is a deliberate bet on future client coverage. Record which it is.

Note also that the declarative documentation page is materially staler than the
imperative one, so verify declarative details before relying on them.

## Step 4, apply the design and security review

Run every check in [the API reference](api-reference.md) tool design review list.
Then apply these assessment-level checks.

1. Both silent-failure gates are addressed explicitly, origin isolation and the
   `tools` Permissions Policy, with the cross-origin iframe case handled if
   relevant.
2. Every consequential tool is annotated as such and has a human confirmation step
   that the page controls, not one the agent is trusted to volunteer.
3. Every tool returning third-party or user-generated text is annotated
   `untrustedContentHint` and sanitised before it can reach a model. Treat tool
   output as a prompt-injection surface.
4. Tools inherit the visitor's own session and therefore the visitor's exact
   authorisation. Confirm no tool grants an agent more than the person already has.
5. No tool is a thin wrapper over a bulk-replace registration pattern. That
   capability was removed from the spec for security reasons.
6. The visible-state pseudo-classes are used so a person can see agent activity.

## Step 5, adjudicate claims

If the request involves a public, community, or client-facing statement, apply the
claim ladder in [claims and maturity](claims-and-maturity.md). Return the exact
wording that is supported, and name each unsupported claim with the reason it
fails. Do not soften an unsupported claim into a vaguer version of itself. Cut it
or attribute it.

The most common failures, in order of frequency: asserting a ranking effect,
asserting traffic capture against the discovery ceiling, asserting conversion with
no data, and quoting the circulating token-savings figure that has no published
methodology.

## Step 6, measurement plan and its limits

State plainly that no external telemetry exists. Whether an agent invoked a tool
cannot be observed by any analytics vendor or browser API. The only route is
self-instrumentation inside each `execute` handler.

A usable plan specifies: what each handler logs, how an agent invocation is
distinguished from a human form submission, what baseline exists before launch, and
an explicit statement that the resulting numbers are not comparable to any other
site's.

Include the honest expectation. The one verifiable public deployment logged zero
external agent calls in 93 days. Plan for the possibility that the instrumentation
records nothing for a long time, and decide in advance what that would mean.

## Output shape

A finding or recommendation row contains: the question being answered, the
evidence and its label, the confidence, the decision, the owner, and the re-check
date. The assessment as a whole contains the maturity statement, the fit verdict,
the scoped tool inventory, the claims ledger, and the measurement plan.

Native, browser, provider, and owner acceptance remain separate and are never
implied by this assessment.

## Error handling

- No supplied site or flow: return needs_input naming exactly what is required.
- No named agent consumer: return the fit assessment with the reachable-agent test
  marked no data, and do not recommend building.
- A supplied Lighthouse or DevTools export of unknown version: retain its exact
  representation and mark the version unverified rather than interpreting it.
- A requester insisting on an unsupported claim: record the dissent, state the
  reason the claim fails, and do not produce the claim. Preserve the disagreement
  in the output rather than resolving it silently.
- Any request to enrol, install, flag, deploy, or register: return needs_approval.
