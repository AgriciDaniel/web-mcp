# Changelog

## 1.0.0 - 2026-09-06

First release.

### Added

- `webmcp` skill with five routes: assess, design, review, claims, api.
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
