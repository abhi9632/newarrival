# /audit — Run a full security audit

Conduct a structured security review of the codebase against the project's documented standards.
Do NOT start coding or making fixes until the full audit report is complete.

## Steps

1. Read `rules/security.md` in full — this is the primary security standard.
2. Read the Security section of `rules/pre-launch-checklist.md`.
3. Read `rules/data-and-forms.md` — covers form-specific security requirements.
4. Scan the codebase systematically against every rule and checklist item. Check actual files — do not assume compliance.
5. Produce a structured audit report in this exact format:

---

### Security Audit Report

**Date:** [today]
**Branch:** [current branch]
**Verdict:** GO / NO-GO

#### Findings

| Rule | Area | Status | Severity | Detail |
|------|------|--------|----------|--------|
| R1 | Error boundary | PASS/FAIL/N/A | — | |
| R2 | Custom 404 | PASS/FAIL/N/A | — | |
| R3 | SafeImage | PASS/FAIL/N/A | — | |
| R4 | Data fetch states | PASS/FAIL/N/A | — | |
| R5 | Form hardening | PASS/FAIL/N/A | — | |
| R6 | HTTP headers + CSP | PASS/FAIL/N/A | — | |
| R7 | Webhook HMAC | PASS/FAIL/N/A | — | |
| R8 | Rate limiting | PASS/FAIL/N/A | — | |
| R9 | Open redirect guard | PASS/FAIL/N/A | — | |
| R10 | Auth cookies (Acuity) | PASS/FAIL/N/A | — | |
| R11 | Env var security | PASS/FAIL/N/A | — | |
| R12 | CORS | PASS/FAIL/N/A | — | |
| R13 | Input validation | PASS/FAIL/N/A | — | |
| R14 | Dependency scan | PASS/FAIL/N/A | — | |
| R15 | Production audit gate | PASS/FAIL/N/A | — | |

For every FAIL: severity (CRITICAL/HIGH/MEDIUM/LOW), file + line, vulnerability, exploit path, exact fix.

#### Blockers (sorted by severity)
[List any CRITICAL or HIGH findings here with exact fix instructions]

#### Manual steps for [CLIENT]
[List anything that requires manual verification, e.g. auth cookie flags, securityheaders.com test]

---

6. After the report: list proposed fixes in priority order. Wait for [CLIENT]'s approval before applying any fix.
