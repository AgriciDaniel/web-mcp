# WebMCP claims and maturity boundary

Read this before any public, client-facing, or community-facing WebMCP statement.
All facts verified against primary sources on 2026-09-05.

## The maturity statement

State this, or an equivalent, in any assessment output.

WebMCP is a Draft Community Group Report at the W3C Web Machine Learning Community
Group, dated 2026-09-04. The spec says of itself: "This specification was published
by the Web Machine Learning Community Group. It is not a W3C Standard nor is it on
the W3C Standards Track." It is not enabled by default in any browser. Chrome runs
an origin trial across versions 149 to 156. Edge runs a separate trial expiring
2026-11-17, with Microsoft stating the feature "may never be enabled beyond this
trial, at Microsoft's sole discretion". The Chrome trial ends 2026-11-17 per Edge's
console on the shared Chromium trial infrastructure; Google's own surfaces could not
be fetched to confirm.

WebKit has formally recorded `position: oppose` (standards-positions #670, closed
2026-06-17) and Mozilla `position: neutral` (#1412, closed 2026-08-26). Chrome
Status still shows "No signal" for both; that field is a lagging cache last edited
2026-08-12. Name the source whenever quoting a position. An earlier version of this
file said both were "No signal", which was wrong. Corrected 2026-09-06.

Calling WebMCP "a W3C standard" is false. Calling it "shipped" is false.

## The four questions people conflate

| Question | Owned by | Does WebMCP answer it |
|---|---|---|
| Can agents find and reach this site | Search, ads, links, GEO | NO |
| Can agents read and cite this content | seo-geo, llms.txt, schema.org | NO |
| Can agents act on this site | WebMCP | YES, this is the whole scope |
| Does any of this affect ranking | seo-technical, seo-geo | NO |

Almost every bad WebMCP claim comes from answering question one or four with
evidence from question three.

## The discovery ceiling

This single sentence from Chrome constrains every traffic and acquisition claim.
Verbatim, from developer.chrome.com/docs/ai/webmcp, page updated 2026-08-07:

> "Clients and browsers must visit a site directly to know if it has callable tools."

There is no registry, no directory, no crawl path, and no robots.txt equivalent for
tools. An agent must already be on the page before WebMCP does anything at all.
WebMCP therefore cannot attract, capture, route, or "land" traffic. It can only
improve what happens to traffic that arrived through some other channel.

Additionally, from developer.chrome.com/docs/ai/webmcp/compare-mcp:

> "WebMCP tools are ephemeral. They exist only when your page is open."

## The claim ladder

Use the highest rung the evidence supports, and no higher.

### Rung 1, supported by official documentation

Chrome's own framing may be quoted directly:

> "WebMCP can help you bridge the gap between web applications and agents,
> improving efficiency, reliability, and task completion."

> "This is more reliable than actuation, which may have numerous steps and leaves
> each step open to interpretation by the agent."

Safe paraphrase: WebMCP gives an agent a declared, typed action instead of making
it infer one from pixels or DOM, which Chrome states is more reliable.

### Rung 2, supported by one vendor benchmark, cite the source and the interest

WindTunnel, at github.com/nekuda-ai/WindTunnel and webmcp.com/benchmark,
Apache-2.0, canonical run 2026-08-20. Methodology: 49 tasks, 8 self-hosted sites,
16 browser-agent configurations, 3 attempts, 2,352 attempts total. Compares WebMCP
tool calling against screenshot computer-use and against DOM/accessibility parsing.

Headline, verbatim: "WebMCP delivers up to 5.5x faster execution, 23x lower cost,
and 12.5x fewer tokens, while solving 98% of tasks."

Selected leaderboard detail: eight configurations tied at 48/49 tasks solved.
Native Sonnet 5 on WebMCP at $0.009 per task median against $0.210 for DOM plus
vision. 6.8 seconds median agent time against 29.3 seconds. 5,172 median tokens
against 64,424.

MANDATORY CAVEATS whenever these numbers are used:

- The publisher, nekuda (nekuda.ai), sells agentic-commerce infrastructure and
  benefits commercially if WebMCP adoption rises. The README does not disclose this.
- It is not peer reviewed and has not been independently replicated.
- It measures self-hosted benchmark sites, not production traffic.
- It measures task success, latency, cost, and tokens. It does NOT measure
  conversion, revenue, or checkout completion.
- Figures differ between the benchmark site and the GitHub README because they are
  different cuts of the same run. Never quote a number without naming the
  configuration and the surface it came from.

Acceptable phrasing: "In one vendor-published benchmark, agents completed tasks
faster, cheaper, and with fewer tokens using WebMCP tools than by driving the
screen. It has not been independently replicated."

### Rung 3, NOT SUPPORTED, do not claim

| Forbidden claim | Why |
|---|---|
| Improves rankings, or hurts rankings | No Google, Bing, or Microsoft statement exists in either direction. The absence is the finding |
| Crawlers read or index your tools | No primary source says this. Architecturally implausible since tools are ephemeral and session-scoped, but no source states it either. This is inference, label it |
| This is where agent traffic lands | Contradicted by the discovery ceiling above |
| Increases conversion | Zero case studies, A/B tests, or revenue data exist from any source |
| Captures agent traffic before competitors | No discovery mechanism exists to capture anything |
| Uses 89% fewer tokens | A circulating community figure with no published methodology, flagged by industry sources as "awaiting formal validation". The WindTunnel token figures are sourced and should be used instead |
| AI traffic converts 3x, so WebMCP converts | Category error. Those figures describe chatbot referral click-throughs, a different phenomenon from a tool invocation on a page the agent already occupies |
| Biggest shift in technical SEO since structured data | A practitioner's explicitly conditional speculation, circulated with its hedge stripped |
| Register with a WebMCP directory to be found by agents | Third-party registries exist but are unofficial, opt-in and self-submitted. No agent client is documented as consuming any of them. The standard still has no discovery |
| Autofill lowers form abandonment by 75%, therefore WebMCP | Chrome's own use-cases page cites this unsourced. It is a general autofill statistic, not a WebMCP or tool-calling result. Adjacent and non-responsive |

## The adoption reality

Include this whenever someone is deciding whether to build.

One verifiable named production deployment exists. A developer shipped three tools
on a personal blog on 2026-02-23 and reported ZERO external agent calls in the 93
days following. The same developer scanned 111,076 domains and found ZERO
production WebMCP implementations. Source:
freecodecamp.org/news/a-developers-guide-to-webmcp/, 2026-05-28.

No major brand, e-commerce platform, or enterprise SaaS deployment could be
verified.

This is not an argument against building. It is the argument for scoping the build
to three or four tools on one high-value flow, and for refusing to forecast return.

## Who can actually call a tool today

| Surface | Live | Conditions |
|---|---|---|
| ChatGPT Work, ChatGPT desktop built-in browser | YES | GPT-5.6 Sol or Terra only. Luna disabled. Not in Enterprise or Edu |
| Codex, ChatGPT desktop built-in browser | YES | Same conditions |
| Plain ChatGPT chat | NOT STATED | The primary doc names only Work and Codex |
| COVERAGE NOTE | | ChatGPT's client sees ONLY imperative top-level tools. Declarative and iframe tools are invisible to it |
| Gemini in Chrome | NO | Described in future tense by every source. Not live |
| Copilot and Edge | NO | Trial only, expires 2026-11-17 |
| Claude in Chrome | NO | Explicitly unimplemented, open feature request |
| Perplexity Comet, Dia, Brave Leo | NO EVIDENCE | No primary source found |

Site owners register nothing with OpenAI. The agent reads what the page exposes.
The origin trial token, where used, is a browser concern, not a client concern.

## Adjacent technology, do not conflate

| Technology | What it actually is |
|---|---|
| llms.txt | Static passive file for an LLM to read. No execution |
| schema.org | Markup describing content for crawlers to index. WebMCP registers actions, not content |
| NLWeb | Microsoft, server-side, turns existing schema.org into a conversational interface |
| Agentic Commerce Protocol | OpenAI and Stripe. Live in ChatGPT Instant Checkout since 2026-02-16. Purchase completes inside the chat, off your site |
| Universal Commerce Protocol | Google and Shopify, launched 2026-01-11, Apache 2.0, with Etsy, Wayfair, Target, Walmart. Commerce-specific |
| MCP servers proper | Headless, external, server-hosted. No browser, no DOM, no user session |
| robots.txt AI directives | Governs fetching and training on static content. Voluntary and spoofable |

## What can and cannot be measured

CAN be measured: AI referral traffic in GA4, manually, by filtering source and
medium for known chat domains. GA4 has no native AI channel. Aggregate automated
versus human traffic share via Cloudflare Radar. Named crawler hits via server logs
or Cloudflare AI Crawl Control.

CANNOT be measured: whether an agent invoked a specific page's tools. No browser
telemetry, analytics vendor, or standard exposes invocation externally. The site
owner must instrument their own `execute` handlers and log calls themselves. There
is no product for attributing conversion or revenue to a tool call, and no
standardised cross-platform agent-traffic metric.

Any measurement plan must therefore start with self-instrumentation, and must state
that the resulting numbers are not comparable to anyone else's.
