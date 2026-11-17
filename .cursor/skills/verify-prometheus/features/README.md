# Prometheus verification map

The portfolio is served at `/`; `/prometheus` permanently redirects there. Start from a current production build and use the helper in [../SKILL.md](../SKILL.md). No login, database, or seed is required. Existing local assets and placeholder fallbacks are the baseline.

| Feature | Helper journey | Coverage |
| --- | --- | --- |
| [Client logos](clients.md) | `clients` | Three logos, current heading, RefillHub hover and keyboard reveal, image loading and viewport overflow |
| [Navigation and services](navigation-services.md) | `navigation` | Desktop Services link; mobile menu, Escape, services submenu; Landing Pages disclosure |
| [Cases and concept gallery](work-showcase.md) | `work` | Two cases, keyboard concept selection, Enter preview, Escape dismissal |
| [Pricing](pricing.md) | `pricing` | Default Business, Personal click, Custom via End, CTA calendar destination |
| [Team](team.md) | `team` | Reach team heading and three profiles |
| [FAQ and contact](faq-contact.md) | `faq` | Independent FAQ answers, keyboard close, Tab into visible contact email |

Each file also lists extended checks. A smoke journey does not verify all entry points, all animation states, or pixel fidelity. Run affected extended checks when changing those behaviors; name any blocked or untested path in the report. Preserve action/result evidence under `.verification/`, including viewport, motion preference and gallery renderer mode when applicable. Use real clicks, keyboard, wheel or touch gestures, and ARIA handles. Read-only DOM observations are evidence; internal state setters are not.

Historical README/HANDOVER claims can be stale (old prices, twelve concepts, a team skip button, Windows paths). Resolve current behavior from the actual page and source. Keep these feature files and their helper synchronized with intentional changes.
