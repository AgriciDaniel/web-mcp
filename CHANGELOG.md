# Changelog

## 1.1.0 - 2026-09-06

Turned the gate into a gate plus a build path. 1.0.0 answered "should you" and
stopped there, which left anyone who passed the fit assessment with nowhere to go.

### Added

- Four routes: `implement`, `scaffold`, `verify`, `trial`.
- `references/implement.md`: authoring rules, character budgets as hard limits,
  the four error patterns, deterministic naming, and the prepare-then-confirm
  pattern for irreversible actions.
- `references/scaffold.md`: gate pre-flight commands and per-framework wiring for
  vanilla, React, Vue, Angular, Next and declarative, with the package identity
  traps called out.
- `references/verify.md`: DevTools WebMCP panel, `webmcp-evals` with the
  `expectedCall` shape, Lighthouse Agentic Browsing, Chrome's five failure modes,
  the silent-failure trap, and a diagnostic table for a tool that will not appear.
- `references/trial.md`: local flag, origin trial token as header or meta tag, the
  2026-11-17 end date, and which clients can actually call your tools.
- `templates/`: seven annotated files. Vanilla, React with the official
  `use-webmcp-tool`, Vue, Angular, declarative form, prepare-then-confirm for
  consequential actions, and untrusted-content handling.
- `scripts/check-templates.sh`: deterministic check for the deprecated accessor in
  executable code, all three annotations set, `signal` threaded into every fetch,
  tool names within budget, and correct declarative attribute casing.
- Three eval cases for the build path, including a wrong-annotation review and an
  honest answer to a request to "measure the uplift".

### Changed

- Boundaries now refuse to DEPLOY rather than refuse to BUILD. It writes code into
  your repository; enrolling trials, setting flags, running CLIs against
  production and modifying live sites remain the owner's actions.
- Imperative registration is the documented default, with the reason stated:
  ChatGPT's Site tools is the only shipping client and it cannot see declarative
  or iframe tools.

### Note

The templates are checked mechanically on every change. No template has been run
against a live agent in production, and that is stated in the README rather than
implied away.

## 1.0.0 - 2026-09-06

First release. Renamed from `claude-webmcp` to `web-mcp` before publication: the
content is runtime-agnostic Markdown and was never Claude Code specific.

### Added

- `AGENTS.md` universal entry point for Codex, Cursor, Copilot, Gemini CLI,
  opencode, Windsurf, Aider, or a plain chat window.
- `skills/webmcp/SKILL.md` Claude Code wrapper over the same content.
- Five routes: assess, design, review, claims, api.
- Fit assessment with four tests. Most sites are expected to fail it, and a
  documented no is a successful run.
- Three-rung claim ladder separating Chrome's documented statements, one vendor
  benchmark, and unsupported claims.
- Verified API reference: WebIDL checked twice against the rendered spec and the
  raw bikeshed source, both silent-failure gates, the annotation contract,
  Chrome's character budgets, `registerTool` exception behaviour, and Chrome's
  own design rules.
- Ecosystem reference covering package identity traps, licence boundaries, and
  the `webmcp.dev` wrong-link problem.
- Five synthetic evaluation cases including a poor-fit refusal and a
  missing-evidence refusal.
- Tiered source ledger in `docs/sources.md` with fetch dates and authority tiers.

### Verification

Five parallel research agents verified every claim against primary sources on
2026-09-05. A three-lane adversarial audit re-checked the result on 2026-09-06.

Six errors were found and corrected before release:

1. An inverted fact about annotation defaults. `readOnlyHint = false` means the
   tool is presumed to mutate, the cautious direction, not a self-declaration of
   read-only-ness.
2. A confirmation-ownership rule presented as Chrome's guidance when Chrome
   explicitly permits agent-driven or browser-driven confirmation.
3. An unlabelled inference that the two gates fail silently. The failure mode is
   undocumented.
4. Wrong browser positions. WebKit has formally recorded oppose and Mozilla
   neutral. Chrome Status still shows "No signal" for both and is a lagging cache.
5. A stale adoption claim resting on a scan dated May 2026.
6. Wrong practical advice preferring the declarative API. The only shipping client
   discovers imperative top-level tools only.

One proposed change was rejected as a double count: the benchmark website and its
repository are the same study from the same publisher, so the skill still says one
benchmark.

### Known gaps

- Whether shipping Chrome exposes `navigator.modelContext` as a deprecated alias
  could not be verified from any primary source. Recorded as `no data`.
- The Chrome origin trial end date of 2026-11-17 comes from Edge's console on the
  shared Chromium trial infrastructure. Google's own surfaces could not be fetched.
- The five evaluation cases are defined, not run. No independent behavioural
  evaluation has been performed.
