# Security

## Reporting

Open a private security advisory on the repository, or contact the maintainer
through https://github.com/AgriciDaniel.

## Scope

This repository contains no executable code. It is instructions and reference
material that any agent runtime can read. The realistic risk is a factual error leading someone to ship an unsafe
tool, so a wrong security claim in this repository is a security issue and should be
reported as one.

## Security topics covered

- The annotation contract, and which defaults are permissive. Two of the three are.
- Tool output as a prompt-injection surface.
- Session inheritance: a tool runs with exactly the visitor's authority.
- Two gates that disable WebMCP, one of them a legacy HTTP header set years ago for
  an unrelated reason.
- `Permissions-Policy: tools=()` as an explicit kill switch for sensitive pages.
- Character budgets published by Chrome as anti-exfiltration controls.
- Why bulk tool registration was removed from the spec, and why restoring it
  reintroduces the vulnerability.
- Supply chain: what the tooling used to build your tools transmits.

## Recorded as absent

Rate limiting, agent identity and attestation, and CSRF-equivalent framing are absent
from the specification and from Chrome's security guidance as of 2026-09-06. The
skill records them as `no data` rather than inventing recommendations.
