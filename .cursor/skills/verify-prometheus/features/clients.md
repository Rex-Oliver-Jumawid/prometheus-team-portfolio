# Client logos

At `/`, scroll to “Clients we're working with” below the hero. Furniture Odyssey, Piercing Corner, RefillHub Sibuyan and ABG Studios appear in that order. Desktop uses four columns; phones stack the logos.

Run `node .cursor/skills/verify-prometheus/scripts/verify.mjs clients` and repeat with `--mobile` and `--reduced-motion`.

The journey checks all eight artwork files load, the neutral RefillHub state, the supplied blue artwork on hover, restoration after pointer exit, and the same reveal when Tab moves from Piercing Corner to RefillHub. It also checks ABG Studios’ metallic artwork on keyboard focus and hover, restoration to cream on exit, and horizontal overflow. Inspect screenshots for spacing, legibility and clipping. Reduced motion should reveal without transition. Phone-sized automation uses a mouse; physical touch hover is not asserted.
