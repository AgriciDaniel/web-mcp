# Sources

Every claim in this skill traces to a source below. Live web pages change without
notice, so each entry records the fetch date and the page's own stated last-updated
date where one exists. This is weaker provenance than a pinned file hash, and it is
recorded as such rather than dressed up.

Sources are graded in three tiers. The tier matters as much as the URL.

## Tier 1: normative and first-party

| Source | Fetched | Page's own date |
|---|---|---|
| webmachinelearning.github.io/webmcp/ | 2026-09-05, 2026-09-06 | Draft CG Report, 2026-09-04 |
| github.com/webmachinelearning/webmcp | 2026-09-06 | commits to 2026-09-04 |
| developer.chrome.com/docs/ai/webmcp | 2026-09-06 | 2026-08-07 |
| developer.chrome.com/docs/ai/webmcp/imperative-api | 2026-09-06 | 2026-09-01 |
| developer.chrome.com/docs/ai/webmcp/declarative-api | 2026-09-06 | 2026-05-18 |
| developer.chrome.com/docs/ai/webmcp/best-practices | 2026-09-06 | 2026-05-18 |
| developer.chrome.com/docs/ai/webmcp/secure-tools | 2026-09-06 | 2026-09-01 |
| developer.chrome.com/docs/ai/webmcp/build-tools | 2026-09-06 | no data |
| developer.chrome.com/docs/ai/webmcp/evals | 2026-09-06 | 2026-05-28 |
| developer.chrome.com/docs/ai/webmcp/compare-mcp | 2026-09-06 | no data |
| developer.chrome.com/docs/lighthouse/agentic-browsing | 2026-09-05 | 2026-05-05 |
| chromestatus.com/api/v0/features/5117755740913664 | 2026-09-06 | field edited 2026-08-12 |
| learn.chatgpt.com/docs/webmcp | 2026-09-06 | no data |
| angular.dev/ai/webmcp | 2026-09-06 | v22.1.5 |
| github.com/WebKit/standards-positions issue 670 | 2026-09-06 | closed 2026-06-17 |
| github.com/mozilla/standards-positions issue 1412 | 2026-09-06 | closed 2026-08-26 |
| W3C WebML CG minutes, 2025-11-11 and 2025-12-18 | 2026-09-06 | as dated |

Two Chrome surfaces could not be fetched. chromestatus.com's HTML page and the
Chrome origin trials console are JavaScript applications that return empty shells.
The API endpoint was used instead where one exists.

## Tier 2: first-party with a commercial interest

| Source | Fetched | Note |
|---|---|---|
| github.com/nekuda-ai/WindTunnel | 2026-09-05, 2026-09-06 | Apache-2.0, run dated 2026-08-20. Publisher sells agentic-commerce infrastructure and does not disclose this in the README. Cite as a vendor benchmark, never as independent validation |
| webmcp.com/benchmark | 2026-09-05 | Same study, same publisher, different surface. Figures differ between the two because they are different cuts. Not a second benchmark |

## Tier 3: independent practitioner evidence

| Source | Fetched | Carries |
|---|---|---|
| freecodecamp.org guide to WebMCP | 2026-09-05 | The zero-invocation result and the 111,076 domain scan, both dated May 2026 |
| ModelPiper, "Eight WebMCP Tools That Registered Nothing" | 2026-09-06 | Independent corroboration of the accessor migration |
| github.com/TueJon/webmcpify | 2026-09-06 | MIT. Client coverage divergence, and the spec / convention / invented classification |
| github.com/ForkPoint/agent-lighthouse | 2026-09-06 | Apache-2.0. Evidence-grading discipline, and a worked example of an auditor checking the deprecated accessor |

## Deliberately excluded

SEO trade publications, vendor blogs, and AI-readiness scoring products with
undisclosed methodology were read to identify circulating claims. They are recorded
as hype inventory in `references/claims-and-maturity.md`, never as evidence for a
positive claim.

Dozens of low-star WebMCP skill repositories were surveyed and excluded. Most
appeared within days of each other and show no adoption.

One practitioner page carries a publication date implausible against the subject
timeline and is treated as undated opinion.

## Recorded as no data

- Whether shipping Chrome exposes `navigator.modelContext` as a deprecated alias.
  No primary Chromium source found. Secondary blogs claim it; several appear to be
  generated content.
- Any conversion, revenue, or checkout-completion measurement, from any source.
- Any Google, Bing, or Microsoft statement linking WebMCP to ranking, in either
  direction. The absence is the finding.
- Rate limiting, agent attestation, and CSRF-equivalent guidance. Absent from the
  spec and Chrome's security pages.

## Rights

No source code, binary, extension, package, or repository content was copied into
this skill. Quoted sentences are short, attributed, and used to fix the meaning of a
normative claim.

The specification is under the W3C Software and Document Licence. Chrome
documentation is under Google's terms. Two surveyed repositories carry no recognised
licence and are reference-only: MiguelsPizza/WebMCP and
chapter42/webmcp-readiness-checker. One surveyed package is AGPL-3.0 and flagged as
a copyleft hazard: `@webmcp/core`.

## Re-verification

Verified 2026-09-05, audited and corrected 2026-09-06.

Re-verify before **2026-12-01**, or immediately if any browser ships WebMCP by
default, or when the Chrome origin trial ends on **2026-11-17**.

Treat an expired horizon as a blocker to use, not a soft warning. The fastest single
check: does a resource use `document.modelContext` or `navigator.modelContext`. The
latter has been superseded since 2026-05-27 and dates anything that uses it.
