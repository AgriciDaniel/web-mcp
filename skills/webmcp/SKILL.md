---
name: webmcp
description: "Decide whether a site should expose WebMCP tools to AI agents, design those tools safely, and separate verified agent-interface capability from the SEO and conversion claims no current evidence supports. Use for a WebMCP readiness review, a tool design or security check, or to adjudicate a public claim before you publish it."
argument-hint: "[assess|design|review|claims|api] <site, flow, tool, or claim>"
metadata:
  version: "1.0.0"
  author: AgriciDaniel
  verified: "2026-09-06"
  reverify_by: "2026-12-01"
---

# WebMCP Readiness

WebMCP lets a page hand AI agents a list of callable actions instead of making them
guess their way through your buttons from a screenshot. This decides whether you
should build any, shapes them if you should, and stops you publishing claims the
evidence does not support.

This file is the Claude Code wrapper. The same content is at `AGENTS.md` in the
repository root for every other agent runtime.

Most sites should not build WebMCP tools yet. Returning that answer with the reasons
is a successful run.

## Routes

| You want | Route |
|---|---|
| Should we build WebMCP tools at all | `assess`, read [method](references/method.md) |
| Scope and shape the tools | `design`, read [method](references/method.md) then [api-reference](references/api-reference.md) |
| Security and correctness review of a proposed tool | `review`, read [api-reference](references/api-reference.md) |
| Is this claim safe to publish | `claims`, read [claims-and-maturity](references/claims-and-maturity.md) |
| Exact API surface, gates, budgets | `api`, read [api-reference](references/api-reference.md) |
| Which package, which repo, what licence | read [ecosystem](references/ecosystem.md) |

## Method

1. State the maturity position first, not as a closing caveat. Read
   [claims-and-maturity](references/claims-and-maturity.md). A reader acts on the
   recommendation and skims the disclaimer, so the disclaimer cannot carry the load.
2. Separate the four questions people conflate: can agents reach this site, can they
   read it, can they act on it, does any of it affect ranking. WebMCP answers only
   the third.
3. Run the fit assessment. Four tests, in [method](references/method.md). Three or
   four passes is a scoped build. Two is defer with a date. Fewer is no.
4. If building, design against [api-reference](references/api-reference.md). Enforce
   the annotation contract and check both silent-failure gates.
5. If adjudicating a claim, apply the claim ladder. Return the exact supported
   wording, and name each failing claim with the reason.
6. Write the measurement plan and its limits. No external telemetry exists.

## What this skill will not do

- Claim WebMCP affects rankings, indexing, crawling, traffic, or conversion. No
  current evidence supports any of them.
- Register a tool, enrol an origin trial, set a browser flag, install an extension,
  run a CLI, or modify a site. It reviews and drafts.
- Present a vendor benchmark as independent validation.
- Invent a statistic, a deployment, a capability, or a currentness claim. Missing
  evidence returns `no data`. Missing decisions return `needs_input`.

## The one fact that governs every marketing claim

Chrome's own documentation:

> "Clients and browsers must visit a site directly to know if it has callable tools."

There is no registry, no directory, no crawl path. An agent must already be on your
page. WebMCP cannot bring you traffic. It changes what happens to traffic you already
have. Third-party directories exist; no agent client is documented as reading them.

## Volatility

Every fact here was verified against primary sources on 2026-09-05 and re-verified
2026-09-06 by a three-lane audit that corrected six errors. WebMCP is pre-standard
and moves weekly. `consequentialHint` was two days old at capture. The Chrome origin
trial ends 2026-11-17.

Re-verify before 2026-12-01, or immediately if any browser ships WebMCP by default.
Treat an expired horizon as a blocker, not a warning. Sources and dates are in
[docs/sources.md](../../docs/sources.md).

## Evaluation

Five synthetic cases in [evals](evals/evals.json): a good fit, a poor fit pushed
enthusiastically, a claim adjudication, a security review, and a missing-evidence
refusal. Case definitions are not a passing run. Nothing here has been through an
independent behavioural evaluation.
