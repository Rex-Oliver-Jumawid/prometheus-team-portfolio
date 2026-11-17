# Client logos

At `/`, scroll to “Clients we're working with” below the hero. Furniture Odyssey, Piercing Corner and ABG Studios appear in that order. Desktop uses three columns; phones stack the logos.

Run `node .cursor/skills/verify-prometheus/scripts/verify.mjs clients` and repeat with `--mobile` and `--reduced-motion`.

The journey checks all six artwork files load, the neutral ABG Studios state, the supplied metallic artwork on hover, restoration after pointer exit, and the same reveal when Tab moves from Piercing Corner to ABG Studios. It also checks horizontal overflow. Inspect screenshots for spacing, legibility and clipping. Reduced motion should reveal without transition. Phone-sized automation uses a mouse; physical touch hover is not asserted.
