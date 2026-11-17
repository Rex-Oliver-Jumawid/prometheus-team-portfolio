---
name: verify-prometheus
description: Verify the Prometheus portfolio web UI at / after user-facing changes or browser bug fixes. Use its browser journeys for navigation, services, work, showcase, pricing, team, FAQ, and contact; update recipes when those flows or verification tooling change.
---

# Verify Prometheus

Work solo unless the user has approved delegation settings under their global instructions. Read [features/README.md](features/README.md), then the affected feature files. Run only affected journeys; shared navigation, scrolling, or global CSS changes need the adjacent sections too.

## Launch

From the repository root, install the locked dependencies and Chromium once per fresh checkout:

```bash
npm ci
npx playwright install chromium
```

No database, authentication, seed account, or mandatory environment variable is needed. `public/` provides local artwork; missing optional showcase slots use placeholders. Leave `SEO_HOMEPAGE_URL` unset for local verification unless testing the explicit SEO configuration.

Run the documented baseline checks after code or tooling changes:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Run typecheck and build sequentially because both generate Next files. A docs-only recipe change needs the affected journey, not another unrelated full suite. Rebuild after app/content/assets change: the browser helper drives `.next` production output, so an old build proves old behavior.

Launch and drive one journey with:

```bash
node .cursor/skills/verify-prometheus/scripts/verify.mjs pricing
```

The helper runs the installed Next CLI as `next start --hostname 127.0.0.1 --port 0`, waits for its `Ready in` log and an HTTP 200 Prometheus page, then opens Chromium. The OS assigns a free port; the exact URL and PID appear in `doctor.json`. The helper owns and tears down that server. It never attaches to a user dev server, including the historical port 3100 mentioned in HANDOVER.md.

Production runs read the same `.next` build. Finish builds before driving; run journeys serially to keep evidence easy to attribute. Development instances share `.next/dev` and its lock, even on different ports; do not start a second dev instance in this checkout.

## Doctor

Before every journey, the helper checks that its child process is alive, `/` returns 200 with the expected Prometheus title, and `.next/BUILD_ID` exists. It records the URL, PID and build ID in `doctor.json`; browser readiness also requires the actual document title. These checks only read the instance.

If launch fails, inspect the run's `server.log` and `report.json` before retrying. A missing `.next/BUILD_ID` means `npm run build` must succeed first. A browser executable error means run `npx playwright install chromium`. On Linux, install system libraries with `npx playwright install --with-deps chromium` if needed.

## Drive

The executable helper [scripts/verify.mjs](scripts/verify.mjs) accepts `clients`, `navigation`, `work`, `pricing`, `team`, or `faq`. Each run starts at `/` with fresh browser state. Add `--mobile` for 390×844 (default 1440×1000), and `--reduced-motion` for reduced-motion coverage:

```bash
node .cursor/skills/verify-prometheus/scripts/verify.mjs navigation --mobile
node .cursor/skills/verify-prometheus/scripts/verify.mjs pricing --reduced-motion
node .cursor/skills/verify-prometheus/scripts/verify.mjs faq --mobile --reduced-motion
```

Recipes use real ARIA names and native keyboard/click actions. See the feature map for entry points and observable assertions. The seeded helper journeys are smoke coverage: extended paths listed in the map still need direct browser work or an additional helper journey when affected. Report the exact entry points exercised.

## Evidence

Each run prints an absolute directory under `.verification/<UTC timestamp>-<feature>/`. It contains:

- `report.json`: feature, viewport, motion preference, build ID, Git HEAD, actions, browser errors/HTTP failures, pass/fail, and server shutdown status. HEAD does not identify uncommitted changes; review `git diff` alongside the run.
- `doctor.json` and `server.log`: instance identity and startup evidence.
- Numbered viewport screenshots and ARIA snapshots: baseline and action/result pairs.
- `trace.zip`: browser actions, screenshots, DOM snapshots and network evidence. Open with `npx playwright show-trace .verification/<run>/trace.zip`, replacing `<run>` with the printed directory name.

A successful exit proves only the assertions for that journey. Inspect screenshots for clipping/overlap and review recorded console/HTTP diagnostics, including missing local assets. An unresolved failure that affects the feature invalidates its verification even if assertions pass. Normal-motion visual fidelity, actual hardware WebGL, touch gestures, and external destination behavior need separate evidence when relevant.

Exercise real user paths. Do not set component state, invoke gallery internals, or use synthetic test-only endpoints as browser proof. Record the triggering action and resulting state; check observable side effects whenever a feature gains persistence or submission. Current interactions change local UI/scroll state only. Contact and case-study destinations can be checked by their actual `href` values without submitting a booking or sending email. Footer social links target Facebook, Instagram and Viber. Check their actual `href` values without opening external apps. `/prometheus` permanently redirects to the portfolio at `/`.

## Cleanup

The helper closes its browser and sends SIGTERM to its own Next PID in `finally`, using SIGKILL only for that PID after five seconds. Failures also capture state and preserve artifacts. Require `serverStopped: true` in `report.json`. If the entire helper was forcibly killed, inspect `doctor.json`, confirm the recorded PID still belongs to that run, and terminate only that process. Never kill by process name or stop the user's existing server.

Evidence survives cleanup in the ignored `.verification/` directory. Confirm `report.json`, `trace.zip`, and at least one screenshot exist before handing back. Keep artifacts locally; commit the skill and helper, not browser traces.

## Maintenance

When a change alters routes, accessible names, plans, FAQ copy, gallery modes, assets, startup, or dependencies, update the affected feature file and helper in the same change and rerun it. Add a feature entry for a new user path. Keep the index honest about automated versus extended coverage and preserve failed preconditions in `Gotchas`. Use `/maintain-verification-skill` when the user requests a full audit; its delegation requirements still require approved model, effort, and count.
