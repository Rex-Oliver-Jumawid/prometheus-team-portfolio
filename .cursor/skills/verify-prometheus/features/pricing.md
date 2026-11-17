# Pricing

Visitors compare Business, Personal and Custom offers, then open the shared consultation calendar through a plan action.

## Sub-features

- `audience`: One selected pricing radio and corresponding accessible region.
- `plans`: Business has three plans, Personal two, Custom one; prices and inclusions follow current content.
- `contact`: Each plan action links to the shared consultation calendar in a new tab.

## How to get to it (user POV)

Click Pricing in Main navigation or Footer navigation, or open `/#pricing`. Use Personal, Business and Custom in Pricing options, then a plan's contact action.

## Driving it with Playwright

Preconditions: current build; run `pricing`; repeat with `--mobile` after responsive changes and `--reduced-motion` after motion changes.

- Automated: expect three articles in `getByRole('region', {name: 'Business pricing', exact: true})`; capture the default state.
- Automated: click radio `Personal`, expect two articles and `₱2,499` in Personal pricing; capture the changed plans.
- Automated: press End on the Personal radio; expect Custom checked, one article in Custom pricing and `Custom pricing` text. Check `Discuss your project: Custom Solution plan` against the shared consultation URL and expect `target="_blank"`, without submitting a booking.
- Extended: ArrowLeft/ArrowRight and Home navigate the radios with matching focus and checked state. Switch rapidly while resizing; inspect settled height, absence of clipped features, and no exposed outgoing duplicate plans. Check calendar destinations for Business and Personal as well as Custom.
- Extended entry points: repeat through both navigation links and the direct fragment. Compare displayed prices/inclusions against `content/pricing.ts` after intentional copy changes.

## Gotchas

- Outgoing cards remain temporarily in an inert, aria-hidden animation panel. Scope assertions to the named active region.
- Current Business offers use peso prices, not the historical dollar plans in README/HANDOVER.
- Checking the booking link proves its configured destination; it does not prove calendar availability or submit a booking.
