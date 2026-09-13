# docs/submission-checklist.md -- the last step, not an afterthought

Nothing in this repo tracked "submitted" as a state before this file existed. Two past
projects both had a working, rehearsed demo and no record of anyone confirming the
actual submission platform (Devpost, the event's own form, whatever it is) was filled
in and turned in before the deadline. A great demo that never got submitted scores zero.

Claimable after `bash scripts/check-freeze.sh` passes and P1-P3 are done. Last task in
the chain, not optional, not "if there's time".

## Checklist

- [ ] Repo is public (or the org/judges have access) and `README.md` has: what it is,
      how to run it locally, the live demo URL, and at least one screenshot
- [ ] Live demo URL loads from a phone on cellular data, not just venue wifi -- confirmed
      by `scripts/check-freeze.sh`, re-check once more right before submitting in case
      the deploy changed since freeze
- [ ] Demo video recorded if the submission platform requires one: uploads, plays back
      clean, is inside any stated time limit
- [ ] All team members added/tagged on the submission platform (not just in the repo)
- [ ] Category/track selected on the submission platform matches what the pitch actually
      argues -- a mismatch here is a free way to score lower on relevance
- [ ] License file present if the event requires one
- [ ] Submission form fields (tagline, description, tech used) match the pitch script,
      not a stale draft from planning
- [ ] Submitted before the platform's stated deadline -- clock times differ from the
      demo/pitch time, confirm both independently
- [ ] Confirmation screenshot or email saved somewhere outside this repo (a submission
      platform outage after the fact is not something git can recover)

## If the event has no separate submission platform

Some events just want the repo link and a live demo at judging time -- nothing to fill
in elsewhere. If so, write that here explicitly ("no separate submission step, judges
use the repo + live URL directly") so a future session doesn't go looking for a form
that doesn't exist. Still confirm the repo is public and the URL is live.
