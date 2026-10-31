# Made in Webflow gallery runtime

`webflow-miw-slider.a0e2db7.js` is the published browser bundle used by Webflow's Made in Webflow section, pinned to `webflow/brand_studio` revision `a0e2db7`.

Source: https://github.com/webflow/brand_studio/blob/a0e2db7/global-brand-code/custom-components/miw-slider.js

Distributed bundle: https://cdn.jsdelivr.net/gh/webflow/brand_studio@a0e2db7/global-brand-code/custom-components/miw-slider.min.js

The adapter in `components/WebflowShowcaseGallery.tsx` supplies Prometheus artwork and controls. No Webflow artwork, logos, marketing copy or browser-frame images are included. Keep the upstream header and provenance when updating the pinned runtime.

Prometheus uses the recovered scroll-driven gallery configuration: `scrollSpan=-3`, `hoverDim=0.65`, drag and horizontal-wheel browsing, keyboard controls, and full artwork previews. Vertical scrolling can dismiss a preview without blocking the page scroll.

Local preview sizing: artwork without browser chrome uses its own image aspect ratio when expanded, rather than the carousel card ratio. The viewport fit is recalculated for the selected image. This avoids gray canvas gutters and fits both narrow and wide artwork without cropping. The React adapter measures the navigation height and reserves that space above the opened renderer, updating on header and visual viewport resizing.
