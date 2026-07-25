# CODEX - agent rules for r1-01 (0rac1es)

Canonical rules live in `C:\rand0m\CODEX.md` (the working-root codex). This
file restates what an agent MUST follow here and adds the r1-01 specifics. If
the two ever disagree, the working-root codex wins.

r1-01 is 0rac1es: a standalone, build-free creation for the rabbit r1, served as
a public GitHub Pages site. It is not the app; the app is `xyz`.

## Owner ethos

- The owner approves; agents execute end to end (implement, commit, push, PR,
  green CI). Never fake a green run.
- Credentials are owner-only. Never create, read into chat, print, or commit a
  secret. This repo needs none.
- Reversible cleanup: park or quarantine, never hard-delete.
- ASCII, no em dashes, in committed text.
- Repo changes ship via PR. The default branch is protected by the org ruleset
  `default-branch-protection` (PR required, 0 required reviewers).

## Concurrency - IMPORTANT

At most ONE write-lane per repo at a time. Parallelize ACROSS repos, never
WITHIN one.

Why: every repo under `C:\rand0m` is a fresh clone sharing per-repo git
worktrees. Two write-lanes in one repo has repeatedly caused mid-edit on-disk
file changes, commits tangling onto another agent's branch, and .git metadata
corruption (NUL-padded config/packed-refs, stale index.lock).

- Read-only lanes (audits, discovery, gh status reads) may run alongside
  anything.
- If you hit a shared-worktree conflict mid-task: STOP. Verify `git status` and
  `git diff` contain only YOUR changes and HEAD is on YOUR branch before
  committing.
- `xyz-docs` is the highest-risk repo org-wide; serialize writes to it.

## Toolchain

**None, and that is deliberate.** This is a BUILD-FREE creation: the site at
`apps/app/dist/` is served as-is. There is no bundler, no package manager, no
compile step.

Do not add one. "Modernising" this into a build pipeline breaks the whole point
(and the r1 device constraints it was written for). If you edit it, edit the
files that ship.

For org context: Flutter 3.38.3 lives at `C:\flutter`; never use `setx` to edit
the USER PATH (it is over the 1024-char setx cap and truncates silently).

## Secrets

**None.** `pages.yml` uses only the built-in GitHub Pages OIDC flow
(`id-token: write`, `pages: write`). No repo secret is required or used. Keep it
that way: this is a public, static, keyless site.

## Workflow

`pages.yml` - "Deploy 0rac1es to GitHub Pages". Serves `apps/app/dist/` at
https://random-knights.github.io/r1-01/ (the URL you load on the r1). Triggers on
push to `main` plus `workflow_dispatch`.

**It is deliberately NOT renamed** to `ci.yml` / `deploy-staging.yml` /
`deploy-prod.yml`. It fits none of those slots honestly:

- it is not a build/test/lint gate, so `ci.yml` would be a lie;
- it deploys the LIVE public site, so `deploy-staging.yml` would be a lie;
- it fires on merge to the default branch, not on a `v*` tag, so
  `deploy-prod.yml` would imply a tag gate that does not exist.

`pages.yml` is also the conventional name for a GitHub Pages deployment and
matches its `concurrency: group: pages`. It is a working, zero-failure deploy;
renaming it buys tidiness and risks the only ship path this repo has.

**Merging to `main` publishes the live site.** There is no staging. Treat every
merge as a release.
