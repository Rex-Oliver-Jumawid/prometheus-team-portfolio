# Cases and concept gallery

Visitors browse two case studies, their stacked project images, and fourteen concept sheets with an expanded preview.

## Sub-features

- `cases`: Furniture Odyssey and Piercing Corner galleries, adjacent-image controls, public-site links.
- `concepts`: Keyboard, horizontal drag/wheel and allowed autoplay through fourteen concepts.
- `preview`: Open artwork, dismiss with Escape/close, restore access to the gallery.
- `renderer`: Hardware WebGL and the real browser's fallback remain usable.

## How to get to it (user POV)

Use Works in the navbar or Work in Footer navigation, or open `/#works`. Scroll past the cases to `#MadeByPrometheus` at `/#showcase`. Focus the Concept gallery group.

## Driving it with Playwright

Preconditions: current build; run `work`; retain the actual renderer mode in evidence.

- Automated: scroll to `#works`, expect two articles, capture them. Scroll to `getByRole('group', {name: 'Concept gallery'})`, focus it, press ArrowRight then Enter. Expect enabled, visible `Close preview`; capture expanded artwork, press Escape and expect the close control hidden.
- Extended cases: use `Next project image` and `Previous project image` within each case's navigation; verify the target figure becomes visible and its story/summary follows the visible image. Scroll backward to confirm reversal. Check each `View Furniture Odyssey live website`/`View Piercing Corner live website` anchor present against the intended URL without submitting anything remotely.
- Extended gallery: test ArrowLeft, drag and horizontal wheel across both ends; confirm all fourteen named concepts, no missing/overlapping gap, and selection after resize. Open through an artwork click and close via `Close preview`; check focus and vertical scroll resume. Test vertical wheel dismissal for the hardware renderer.
- Extended motion/graphics: repeat with `--reduced-motion`, then change the preference live during a preview; check accessible preview still works. Use an actual hardware-backed browser to prove WebGL appearance and touch behavior. Capture screenshots before/after actions at desktop and mobile widths.

## Gotchas

- Headless Chromium may select the production fallback because software renderers are rejected. Fallback proof does not establish hardware WebGL fidelity; do not force internal renderer state.
- Current content has fourteen slots; missing optional `public/showcase/sheet-01` through `sheet-14` artwork uses labeled placeholders.
- Case screenshots depend on files present at build time. Missing optional files show overview/scope panels; a journey requiring a missing screenshot must be reported blocked with its path.
- Artwork entrance can delay Close preview; wait for enabled state rather than clicking through it.
- The existing case flag SVG emits two invalid-path console diagnostics on page load. They are captured in reports; a journey passing does not verify that flag's visual correctness.
