# /audit -- Pre-demo audit

Report first. Do not fix anything until the report is complete and the human has read it.

## 1. Secrets (run this first, always)

```bash
grep -rnE "github_pat_|ghp_|gho_|sk-[A-Za-z0-9]{20}|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY" \
  --exclude-dir=node_modules --exclude-dir=.git . | head -40
```

Any hit is a finding, including in HTML, demo pages and dashboards. A live GitHub PAT
once shipped in this template's own sprint board. If a secret is found: it must be
rotated by the human, not just deleted from the file, because it stays in git history.

## 2. Demo path

Walk every step of the click path in `docs/pitch-playbook.md`. Note every broken
interaction. Check `docs/demo-prep.md` for the full checklist.

## 3. Visual

For each screen on the demo path, confirm a visual gate entry exists in
`design-system/README.md`. A screen with no entry has never been looked at.

## 4. States and access

- Every fetch: loading, error and empty states reachable (`rules/data-and-forms.md`)
- Every form: pending-disable, input preserved on error (`rules/data-and-forms.md`)
- Keyboard reachable, focus visible, 44px touch targets (`rules/quality.md`)
- 375px: no overflow. 1280px: no broken layout

## 5. Copy

No em dashes, no lorem, no placeholder names, no visible TODO.

## Report format

| Severity | File:line | Finding | Fix |
|---|---|---|---|

Order: secrets, then anything on the demo path, then everything else.
