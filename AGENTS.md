## Saved versions

- When the user asks for the saved version with Piercing Corner in case studies, follow [documentation/agents.md](documentation/agents.md).

## Verification

- Before verifying user-facing changes or investigating browser behavior, read [.cursor/skills/verify-prometheus/SKILL.md](.cursor/skills/verify-prometheus/SKILL.md) and its feature index. Run the affected journeys and the checks required there before reporting success.
- When routes, controls, content, assets, startup, or tooling change, update the affected verification recipes and helper in the same task. Rerun changed recipes; report blocked or untested paths explicitly. Use `/maintain-verification-skill` for a full map audit when requested.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
