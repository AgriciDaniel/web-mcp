# WebMCP ecosystem, packages, licences, tooling

Verified 2026-09-05. Star counts and download figures are point-in-time.

## Canonical sources, use these

| Resource | What it is | Licence |
|---|---|---|
| webmachinelearning.github.io/webmcp | The spec. Draft Community Group Report | W3C Software and Document Licence |
| github.com/webmachinelearning/webmcp | Spec repo and explainer. 3,796 stars, active | W3C licence, GitHub reads NOASSERTION |
| developer.chrome.com/docs/ai/webmcp | Chrome's documentation, six subpages plus build-tools | Google terms |
| github.com/webmachinelearning/awesome-webmcp | Official curated link list. 42 stars | CC0-1.0 |
| github.com/GoogleChromeLabs/webmcp-tools | Demos, evals CLI, polyfill. 564 stars. Says "not an officially supported Google product" | Apache-2.0 |

The `explainer` demo inside webmcp-tools is the side-by-side DOM-scrape versus
tool-call comparison. Its README describes it as showing "how AI agents interact
with a web page today (site scraping) and a future where the page declares
structured tools with WebMCP". It is a demonstration artifact and reports no
metrics.

## DO NOT LINK: webmcp.dev

webmcp.dev is NOT the standard. It is a GitHub Pages site, last modified
2026-02-15, serving the demo for github.com/jasonjmcghee/WebMCP, an unrelated MIT
library by Jason McGhee from roughly March 2025.

The live page still documents a localhost WebSocket bridge, a blue widget UI, and
manual Claude Desktop `mcpServers` configuration. None of that relates to
`document.modelContext`.

The GitHub repo added a disclaimer on 2026-02-12: "This was an early WebMCP
proposal / implementation... The idea of WebMCP has since evolved and is being
worked on by much more capable folks that develop the web," pointing readers to the
W3C repo.

CRITICAL: that disclaimer exists only on the GitHub README. webmcp.dev itself
carries no notice. Anyone following a webmcp.dev link sees no indication it is
superseded. Link the spec or the Chrome docs instead.

## Package naming hazards

At least eight distinct publishers ship packages containing "webmcp". Getting this
wrong is easy and consequential.

| Package | Publisher | Version, published | Weekly downloads | Verdict |
|---|---|---|---|---|
| webmcp-types | OFFICIAL, webmachinelearning | 0.1.6, 2026-09-03 | 19,424 | The official typings |
| use-webmcp-tool | OFFICIAL, GoogleChromeLabs, Chrome DevRel | 0.2.0, 2026-07-30 | 2,206 | The official React binding. Documents the navigator deprecation |
| @mcp-b/* family, usewebmcp | Third party, WebMCP-org / MCP-B | 5.1.0, 2026-08-31 | 6,692 to 59,222 | De facto community SDK. MIT. Cited in awesome-webmcp. Larger adoption than the official packages |
| Angular `experimentalWebMcpTool` | OFFICIAL, Angular team | in @angular/core v22.x | built in | Docs: "currently experimental. APIs are subject to change" |
| vue-webmcp, nuxt-webmcp, svelte-webmcp, astro-webmcp | Community | various, 2026-07 to 2026-08 | 79 to 743 | No core-team backing |
| @webmcp/core, @webmcp/react | dpx10, unaffiliated | 0.2.x, 2025-08 | very low | LEGACY, predates the API rename. `@webmcp/core` is AGPL-3.0 |
| webmcp, bare name | melvincarvalho | 0.0.1, 2025-02-02 | very low | Name-squat predating the API. Not the standard |
| react-webmcp | tech-sumit | 0.3.0, 2026-03-03 | 1 | Stale, effectively abandoned |

Two traps worth stating explicitly. First, `usewebmcp` is the third-party package
while `use-webmcp-tool` is the official one, and the community package has roughly
three times the downloads. Second, `@mcp-b/webmcp-types` and `webmcp-types` are
different packages from different publishers.

## Licence boundary

Safe to adapt with attribution: the W3C spec, webmcp-types, awesome-webmcp (CC0),
GoogleChromeLabs repos and use-webmcp-tool (Apache-2.0, NOTICE required),
model-context-tool-inspector (Apache-2.0), the @mcp-b family and usewebmcp (MIT),
vue-webmcp (Apache-2.0), WindTunnel (Apache-2.0), ForkPoint/agent-lighthouse
(Apache-2.0).

DO NOT adapt: MiguelsPizza/WebMCP carries no recognised licence, GitHub reads
NOASSERTION, so it is all rights reserved. chapter42/webmcp-readiness-checker has
no licence file, same conclusion. Both are reference-only.

COPYLEFT: `@webmcp/core` is AGPL-3.0 and triggers source-disclosure obligations in
a proprietary product. eticastudio/rankready is GPL-2.0.

## Third-party agent skills, honest grading

There is no dominant, well-adopted WebMCP skill pack. The category is a swarm of
near-identical low-star single-author repos, many published within days of each
other in August and September 2026, and a "WebMCP Challenge" hackathon around
2026-09-03 to 2026-09-05 produced a further wave of zero to two star entries. Most
of it is unproven and freshly generated. Treat the category as noise unless a
specific repo is inspected.

The two exceptions with real multi-file structure, MIT licensing, and active
September commits: nekuda-ai/webmcp-kit (28 stars) and TueJon/webmcpify (7 stars).

In the WebMCP-plus-SEO category, ForkPoint/agent-lighthouse (17 stars, Apache-2.0,
npm published, CI, documentation, 215 audits) is the only entry resembling a real
product. It was created 2026-08-17 and its scoring has not been independently
validated. Note also that sparrow84001/mcp-seo is an MCP server, not WebMCP,
despite the name.

## Official tooling, all shipped

Chrome DevTools WebMCP panel in the Application tab. Lighthouse Agentic Browsing
category, requiring Chrome 150 or later, with WebMCP audits requiring origin trial
registration. The webmcp-evals CLI. The Model Context Tool Inspector extension by
Francois Beaufort of Google Ireland, whose listing states it is "not an officially
supported Google product".

A separate, unrelated extension named "WebMCP Inspector" is published by a
different company with a paid multi-provider AI chat. Do not confuse the two.

## Benchmark

github.com/nekuda-ai/WindTunnel, 17 stars, Apache-2.0, Playwright and Docker
harness, published results and specification. See
[claims and maturity](claims-and-maturity.md) for the numbers and the mandatory
caveats. Cite it as a vendor benchmark with an undisclosed commercial interest,
never as independent validation.
