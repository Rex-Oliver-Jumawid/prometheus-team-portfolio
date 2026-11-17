# Navigation and services

Visitors move between portfolio sections and expand descriptions of website, business-system and custom services.

## Sub-features

- `nav-desktop`: Services, Works, Pricing, About and Contacts reach their sections.
- `nav-mobile`: Open/close menu, Escape/focus return, outside dismissal and service-category submenu.
- `services`: Native disclosures work with mouse and keyboard across all three categories.

## How to get to it (user POV)

Open `/`; use Main navigation, hero service links, or footer Services. Mobile Services expands to Websites, Business Systems and Custom Solutions. Direct entry points are `#services`, `#services-websites`, `#services-business-systems`, and `#services-custom-solutions`.

## Driving it with Playwright

Preconditions: current build; use `navigation` with and without `--mobile`.

- Automated: desktop `getByRole('navigation', {name: 'Main navigation'}).getByRole('link', {name: 'Services', exact: true}).click()` reaches services. Clicking the `Landing Pages` summary reveals its description; Enter closes it.
- Automated mobile: click `Open menu`, expect expanded `Close menu`; press Escape and expect focus on `Open menu`. Reopen, click `Expand services`, click the exact `Websites` link; expect closed menu and the Websites category reachable.
- Extended: click Works, Pricing, About and Contacts individually; observe the corresponding section in the viewport. Re-enter through the hero service pills and Footer navigation's Services link. At mobile width reopen the menu and click outside; expect closed and no focusable hidden menu links. Visit Business Systems/Custom Solutions submenu entries and open one native summary per group using Space.
- Extended appearance: scroll beyond 16px and back; inspect navbar dark tint, readability and stable hero geometry. Capture mobile open/closed menu states and desktop tint over the cream services panel.

## Gotchas

- Mobile breakpoint is 991px; use `--mobile` rather than assuming a desktop hidden button is actionable.
- Smooth scrolling can leave the URL hash unchanged; assert destination visibility instead of relying only on `page.url()`.
- Footer proximity moves navigation out of view. Return to the top before repeating navigation checks.
