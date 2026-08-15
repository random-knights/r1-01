# RUNBOOK - r1-01 / 0rac1es (human operator)

For agent rules see `AGENTS.md`. `README.md` describes the creation itself; this
is the operator path.

0rac1es is a build-free static site for the rabbit r1, served by GitHub Pages at
https://random-knights.github.io/r1-01/

## Quick start

There is nothing to install and nothing to build.

```powershell
cd C:\rand0m\r1-01
# the site that ships IS apps/app/dist/ - open it in a browser
```

Edit the files that ship. Do not add a bundler or a package manager: this is
build-free on purpose, for the r1's constraints.

## How to deploy

**Merging to `main` publishes the live site.** `pages.yml` runs on push to
`main` (and on dispatch) and deploys `apps/app/dist/` to GitHub Pages.

There is no staging. Every merge is a release. If you want to check something
first, open the file locally in a browser.

## How to roll back

Open a revert PR and merge it - that redeploys the previous content, usually
within a minute or two. Never force-push `main`; the org ruleset blocks
non-fast-forward and deletion on the default branch.

You can also re-run the last good `pages.yml` run from the Actions UI to
redeploy that build.

## Where secrets live

**Nowhere.** `pages.yml` uses only the built-in GitHub Pages OIDC flow
(`id-token: write`, `pages: write`). No repo secret is required or used, and none
should be added: this is a public, static, keyless site.

Org-wide: live keys are owner-laptop only at `C:\rand0m\.secrets\`. Never commit
or print one.

## What breaks and how to fix it

| Symptom | Cause | Fix |
|---|---|---|
| Site did not update after merge | `pages.yml` failed, or Pages is still publishing | Check the Actions run. `concurrency: group: pages` cancels an in-flight deploy if a new one starts - re-run if it was cancelled. |
| Deploy fails on permissions | the Pages OIDC flow needs `pages: write` + `id-token: write` | Those are declared in the workflow. If Pages was disabled in repo settings, only the owner can re-enable it. |
| It works locally but not on the r1 | device constraints (screen, scroll wheel, no build step) | Test on the device. Do not "fix" it by adding a build pipeline. |
| Someone added a bundler | this creation is build-free by design | Revert. `apps/app/dist/` is what ships, as-is. |

## Escalation

The app is `xyz`. Ecosystem docs live in `xyz-docs`. Requests and issues:
[123](https://github.com/random-knights/123/issues).
