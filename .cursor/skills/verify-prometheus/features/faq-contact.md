# FAQ and contact

Visitors open independent FAQ answers, then reach an email link, site navigation and the team booking link in the footer.

## Sub-features

- `answers`: Seven native FAQ disclosures, independently open and keyboard operable.
- `animation`: Rapid reversal and live reduced-motion changes.
- `footer`: Keyboard access and reveal, local navigation, mailto and calendar destinations.

## How to get to it (user POV)

Scroll past the team or open `/#faq`. Reach `#contacts` from Main navigation's Contacts or scrolling below FAQ. Footer navigation has Services, Work, Pricing and About.

## Driving it with Playwright

Preconditions: current build; run `faq`; use `--mobile` and `--reduced-motion` after relevant layout/motion changes.

- Automated: click summary `Is it really free to get started?`; expect its details open and answer visible, then capture. Click `What if I don't like what you've built?`; expect both answers open. Press Enter on the first summary; expect only the second still open.
- Automated: focus the final FAQ summary and press Tab; expect the `Email prometheus.exps@gmail.com` link focused and in the viewport, with `mailto:prometheus.exps@gmail.com`. Capture the visible focus/revealed footer.
- Extended answers: operate all seven summaries with Enter/Space, reverse an expansion rapidly, and toggle motion preference mid-animation. In a JavaScript-disabled context confirm the native summaries still open.
- Extended footer: Tab through all footer links from FAQ; confirm each focused link remains visible. Compare the actual booking `href` with `content/contact.ts` without submitting a meeting. Test all four local navigation links, plus direct `#contacts` and Pricing/Contacts entry points.
- Extended appearance: inspect footer reveal at 1440×1000, 390×844, 320×740 and a short desktop viewport; check the rounded FAQ foreground, readable focus states, stationary cropped wordmark and no horizontal overflow. Capture before/during/after scrolling.

## Gotchas

- Closing a normal-motion FAQ takes about 400ms; wait on the observable details state.
- Sticky footer behavior differs on mobile, short viewports and reduced motion; verify each affected layout.
- Calendar currently targets the shared project consultation in `content/contact.ts`. Verifying its link does not verify a completed booking.
- Facebook, Instagram and Viber are links. Check their destinations without launching an external app; presence alone does not verify the external service.
