# Manual actions: NewArrival

Everything here needs Abhi. Claude-doable work never lands in this file, it just gets done.
Kept separate from `docs/pending-tasks.md` so these can be actioned in parallel with the build.

## Infra and accounts

- [ ] [2026-09-22] **Authorise Vercel on `abhi9632/newarrival` and import the project.** DEFERRED by Abhi on 2026-09-22: build runs locally first, so this no longer blocks Phase 1. It still has to happen before the demo, because SHIP-03 (a public URL) is unmet without it and a local-only demo dies with the laptop. Do it any time before feature freeze at 19:30. The repo is private, so Vercel needs explicit GitHub App access. There is no CLI or API path for this authorisation, which is why it is here.

  Claude has already pushed a building Next.js app to `main`. Nothing else needs building before this deploys.

  1. Open https://vercel.com/new and sign in with GitHub as @abhi9632.
  2. Under "Import Git Repository", find `abhi9632/newarrival`. If it is not listed (it is private), click "Adjust GitHub App Permissions", grant the Vercel app access to `newarrival` only using "Only select repositories", not "All repositories". Save, then return to the Vercel tab.
  3. Click "Import" next to `abhi9632/newarrival`.
  4. Framework Preset should auto-detect "Next.js". Leave Root Directory as `./` and leave Build Command, Output Directory and Install Command at their defaults. Add no Environment Variables: this app has no secrets and none may be created.
  5. Click "Deploy" and wait for the build.
  6. Go to Settings, then Deployment Protection. Confirm "Vercel Authentication" is **Disabled** for Production. If it is left enabled, a judge or a phone browser hits a login wall instead of the app.
  7. Copy the Production URL from the project overview and paste it into the session.

  Paste only the public production URL. No token, key or password goes into chat, ever.

## Open decisions

- [ ] [2026-09-22] **Decide whether `abhi9632/newarrival` goes public before the demo.** It is private right now. Judges sometimes want to read the source, and the repo holds no secrets, so making it public costs nothing. One command when you want it: `gh repo edit abhi9632/newarrival --visibility public`. Not blocking anything.

## Done

(none yet)
