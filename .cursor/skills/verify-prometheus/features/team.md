# Team

Visitors scroll through a Team cover to a three-person team layout; reduced motion exposes the team without the extra reveal animation.

## Sub-features

- `profiles`: Three named profiles with role and portrait.
- `reveal`: Scroll-driven opening and closing cover.
- `motion`: Reduced-motion and JavaScript-disabled access.

## How to get to it (user POV)

Click About in Main navigation or Footer navigation, open `/#about`, or scroll down from pricing.

## Driving it with Playwright

Preconditions: current build; run `team`, then `team --reduced-motion` when changing motion/accessibility.

- Automated: scroll the heading `Meet the team behind Prometheus` into view; expect three list items in `getByRole('list', {name: 'Prometheus team'})` and capture the visible heading/profiles.
- Extended reveal: scroll down from pricing in small wheel steps, capture the Team cover closed, partly open and fully open; verify the actual profile text is unobscured in the final screen. Reverse scrolling and capture closure. Heading presence alone does not prove the cover moved.
- Extended entries/access: enter through both About links and the fragment; confirm the readable team is reachable. Change reduced-motion preference while in the section. In a fresh browser context with JavaScript disabled, open the fragment and confirm names/roles are visible. Repeat at mobile width.

## Gotchas

- There is no current Meet the team skip button; older documentation describes one.
- Normal-motion cover geometry requires screenshot inspection; the smoke assertions cover list presence and reachability only.
- Match names, roles and portrait expectations to `content/team.ts`; do not treat illustrated/sample assets as missing real portraits.
