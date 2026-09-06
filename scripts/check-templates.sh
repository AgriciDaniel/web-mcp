#!/usr/bin/env bash
# Deterministic correctness check for the WebMCP templates.
#
# If a deterministic check can decide something, use the check. A repo that
# warns about wrong WebMCP code must not ship wrong WebMCP code.
#
# Usage: ./scripts/check-templates.sh
# Exit 0 = pass, 1 = fail.

set -uo pipefail
cd "$(dirname "$0")/.."

FAIL=0
note() { printf '  %-9s %s\n' "$1" "$2"; }
fail() { note "FAIL" "$1"; FAIL=1; }
pass() { note "ok" "$1"; }

echo "WebMCP template checks"
echo

# 1. The deprecated accessor must not appear in EXECUTABLE code.
# Comment lines are allowed, since the templates deliberately warn against it.
# A check that fires on its own warning text is a check people learn to ignore.
echo "1. deprecated accessor"
hits=$(grep -rn 'navigator\.modelContext' templates/ 2>/dev/null \
  | grep -vE ':[[:space:]]*\*' \
  | grep -vE ':[[:space:]]*//' \
  | grep -vE ':[[:space:]]*/\*' \
  | grep -vE ':[[:space:]]*#' \
  | grep -vE '<!--')
if [ -n "$hits" ]; then
  printf '%s\n' "$hits" | sed 's/^/     /'
  fail "executable code uses navigator.modelContext (superseded 2026-05-27)"
else
  warned=$(grep -rl 'navigator\.modelContext' templates/ 2>/dev/null | wc -l | tr -d ' ')
  pass "no navigator.modelContext in executable code (${warned} file(s) warn about it in comments)"
fi

# 2. Every template that registers a tool must set all three annotations.
echo
echo "2. annotation contract"
for f in templates/*.js templates/*.tsx templates/*.ts; do
  [ -e "$f" ] || continue
  grep -q 'registerTool\|useWebMcpTool\|experimentalWebMcpTool' "$f" || continue
  missing=""
  for a in readOnlyHint untrustedContentHint consequentialHint; do
    grep -q "$a" "$f" || missing="$missing $a"
  done
  if [ -n "$missing" ]; then fail "$f missing:$missing"; else pass "$f all three set"; fi
done

# 3. AbortSignal must be accepted and threaded into fetch.
echo
echo "3. signal threading"
for f in templates/*.js templates/*.tsx templates/*.ts; do
  [ -e "$f" ] || continue
  grep -q 'fetch(' "$f" || continue
  if grep -q 'signal' "$f"; then pass "$f threads signal"; else fail "$f calls fetch without signal"; fi
done

# 4. Tool names: <= 30 chars guidance, ASCII alnum _ - . only.
echo
echo "4. tool names"
names=$(grep -rhoE "name: *'[a-zA-Z0-9_.-]+'" templates/ | sed "s/.*'\(.*\)'/\1/" | sort -u)
for n in $names; do
  len=${#n}
  if [ "$len" -gt 30 ]; then fail "name '$n' is $len chars (guidance 30, hard limit 128)"
  elif ! printf '%s' "$n" | grep -qE '^[A-Za-z0-9_.-]+$'; then fail "name '$n' has an illegal character"
  else pass "name '$n' ($len chars)"; fi
done

# 5. Declarative attributes must be lowercase and unhyphenated.
echo
echo "5. declarative attributes"
if grep -rnE 'tool-name|tool-description|data-toolname|toolParamDescription' templates/ >/dev/null 2>&1; then
  fail "hyphenated or data- prefixed tool attributes found"
else
  pass "declarative attributes correctly lowercase and unhyphenated"
fi

# 6. Consequential template must actually set consequentialHint: true.
echo
echo "6. consequential pattern"
if grep -q 'consequentialHint: true' templates/consequential-prepare-confirm.js 2>/dev/null; then
  pass "prepare-confirm sets consequentialHint: true"
else
  fail "prepare-confirm template does not set consequentialHint: true"
fi
if grep -q 'untrustedContentHint: true' templates/untrusted-content.js 2>/dev/null; then
  pass "untrusted-content sets untrustedContentHint: true"
else
  fail "untrusted-content template does not set untrustedContentHint: true"
fi

# 7. References must not contradict the imperative-first rule.
echo
echo "7. docs consistency"
if grep -q 'document.modelContext' skills/webmcp/references/api-reference.md; then
  pass "api-reference documents document.modelContext"
else
  fail "api-reference does not document document.modelContext"
fi

# 8. Execute the templates and validate the real tool objects.
echo
echo "8. runtime tool validation"
if command -v node >/dev/null 2>&1; then
  if node scripts/check-tools.mjs; then :; else fail "runtime tool validation failed"; fi
else
  note "skip" "node not available, runtime validation skipped"
fi

echo
if [ "$FAIL" -eq 0 ]; then echo "PASS"; else echo "FAILED"; fi
exit "$FAIL"
