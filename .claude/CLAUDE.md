# Agent rules (r1-01 / 0rac1es)

**Read `../AGENTS.md` in this repo root and follow it. It is the authority for
this repo.** Canonical org rules live in `C:\rand0m\CODEX.md`; the repo CODEX
restates them and adds the local specifics. `RUNBOOK.md` is the human guide.

0rac1es is a build-free static creation for the rabbit r1, served via GitHub
Pages. The app is `xyz`.

The four that bite hardest here:

1. **It is BUILD-FREE on purpose. Do not add a toolchain.** No bundler, no
   package manager, no compile step. `apps/app/dist/` is what ships, as-is.
   "Modernising" it breaks the point and the r1's constraints.
2. **Merging to `main` publishes the LIVE site.** There is no staging. Treat
   every merge as a release.
3. **No secrets.** Pages deploys via the built-in OIDC flow. Never add one.
4. **ONE write-lane per repo.** Parallelize across repos, never within one.

`pages.yml` is deliberately NOT renamed to the ci/deploy-staging/deploy-prod
standard: it is not a gate, it is not staging, and it is not tag-gated. See
AGENTS.md. Never fake a green run. Credentials are owner-only.
