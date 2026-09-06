# Trial: local development and the origin trial

WebMCP is not on by default in any browser. Nothing you build runs for a real
visitor until either the origin trial covers your origin, or a browser ships it by
default. Neither has happened as of 2026-09-06.

Enrolling, setting flags and installing extensions are the site owner's actions.
This skill does not perform them.

## Local development

```
chrome://flags/#enable-webmcp-testing
```

UI label is "WebMCP for testing". Flag name confirmed unchanged as of 2026-09-04.

Minimum version, two figures, both correct for different things:

- The flag first shipped at Chrome 146.0.7672.0.
- The Model Context Tool Inspector extension pins 150.0.7861.0 as its own floor,
  most plausibly because the API changed substantially between March and August
  2026. That reasoning is inference; no primary source states it.

If you are only using DevTools, 146 is enough. If you want the inspector extension,
you need 150.

No token is needed locally.

## Production during the trial

Chrome trial ID `4163014905550602241`, covering Chrome 149 to 156 across desktop,
Android and WebView.

Serve the token either as an HTTP response header:

```
Origin-Trial: <your token>
```

or as a meta tag in the document head:

```html
<meta http-equiv="origin-trial" content="<your token>">
```

The header is preferable when you control the edge, because it survives HTML
caching layers that might serve a stale document.

A token is bound to an origin. A token for `https://example.com` does not cover
`https://app.example.com`.

## The trial ends 2026-11-17

Source: Microsoft Edge's origin trials console, which runs on the same Chromium
origin-trial token infrastructure. Corroborated by milestone data, with M156 stable
2026-10-20 and M157 stable 2026-11-03, placing 2026-11-17 roughly two weeks after
M157.

CAVEAT: this is Microsoft's console, not Google's. Chrome's own chromestatus page
and origin trials console are JavaScript applications that return empty shells to
direct fetches, so this could not be confirmed from a Google surface.

Plan for the end date. When the trial expires, registration stops working for real
visitors unless the feature has shipped by default or the trial is extended. Your
tools should degrade to nothing rather than throwing, which is what the
`'modelContext' in document` guard is for.

## Microsoft Edge

Edge runs a SEPARATE origin trial with its own trial ID, expiring 2026-11-17.
Microsoft states the feature "may never be enabled beyond this trial, at
Microsoft's sole discretion".

A Chrome token does not cover Edge. Enrol separately if you want Edge coverage.

## Who can actually call your tools once you ship

| Surface | Live today | Conditions |
|---|---|---|
| ChatGPT Work, ChatGPT desktop built-in browser | Yes | GPT-5.6 Sol or Terra only. Luna disabled. Not on Enterprise or Edu |
| Codex, ChatGPT desktop built-in browser | Yes | Same conditions |
| Plain ChatGPT chat | Not stated | The primary doc names only Work and Codex |
| Gemini in Chrome | No | Described in future tense by every source |
| Copilot and Edge | No | Trial only |
| Claude in Chrome | No | Explicitly unimplemented, open feature request |
| Perplexity Comet, Dia, Brave Leo | No evidence | No primary source |

Site owners register nothing with OpenAI. The agent reads what the page exposes.
The origin trial token is a browser concern, not a client concern.

Remember the coverage limit: ChatGPT's client sees only imperative, top-level
tools. Declarative and iframe tools are invisible to it.

## Do not confuse a trial with a launch

Shipping tools behind an origin trial means a small, model-gated slice of one
vendor's product can call them, for a window that closes on a known date. That is a
reasonable experiment. It is not a channel, and it is not a launch.

Re-read [claims-and-maturity.md](claims-and-maturity.md) before anyone writes a
blog post about it.
