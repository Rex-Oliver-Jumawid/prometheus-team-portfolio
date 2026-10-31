"use client";

import { useEffect, useRef, useState } from "react";
import type { ShowcaseSheet } from "../content/showcase";
import ShowcaseGallery from "./ShowcaseGallery";
import "../app/prometheus/webflow-showcase.css";

type Slider = { close(): void; destroy(): void; set(key: string, value: number): void; state(): { isOpen: boolean } };
type SliderRoot = HTMLDivElement & { _mw?: Slider };
type SliderWindow = Window & { MwSlider?: { init(root: HTMLElement): Slider | null } };
let runtime: Promise<void> | undefined;

function loadRuntime() {
  if ((window as SliderWindow).MwSlider) return Promise.resolve();
  if (!runtime) runtime = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/webflow-miw-slider.a0e2db7.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { runtime = undefined; script.remove(); reject(new Error("Gallery runtime unavailable")); };
    document.head.appendChild(script);
  });
  return runtime;
}

function supportsHardwareGallery() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software/i.test(renderer);
  } catch { return false; }
}

function placeholder(sheet: ShowcaseSheet) {
  const title = sheet.title.replace(/[&<>"']/g, "");
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="800"><rect width="1400" height="800" fill="#eddcc6"/><text x="80" y="140" font-family="sans-serif" font-size="64" fill="#101216">${title}</text></svg>`)}`;
}

export default function WebflowShowcaseGallery({ sheets }: { sheets: ShowcaseSheet[] }) {
  const root = useRef<SliderRoot>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    let slider: Slider | undefined;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreview = () => { fitPreview(); };
    const dismissOnScroll = () => {
      if (slider?.state().isOpen) slider.close();
    };
    const dismissOnWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.shiftKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        dismissOnScroll();
        // Let this event bubble to Lenis. Blocking it desynchronizes smooth
        // scrolling from the native page position and causes jumps on exit.
      }
    };
    const fitPreview = () => {
      // Match the actual header height, including responsive spacing and zoom.
      const header = document.querySelector<HTMLElement>(".prometheus-navbar");
      const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      element.style.setProperty("--mw-preview-top", `${top}px`);
      if (!slider) return;
      // Upstream adds a 7%-of-width inset before frameGap. Replace that
      // generous inset with a small responsive safe margin for our artwork.
      const baseInset = Math.max(28, Math.min(96, element.clientWidth * .07));
      slider.set("frameGap", (element.clientWidth <= 767 ? 16 : 24) - baseInset);
    };
    const initialize = () => {
      if (cancelled) return;
      (slider ?? element._mw)?.destroy();
      // The GL renderer holds image sources while drawing textures. Restore
      // them before a preference-driven rebuild or a no-WebGL fallback.
      element.querySelectorAll<HTMLImageElement>("img[data-mw-held-src]").forEach(image => {
        image.src = image.dataset.mwHeldSrc!;
        delete image.dataset.mwHeldSrc;
      });
      if (!preference.matches && !supportsHardwareGallery()) { setFallback(true); return; }
      element.setAttribute("data-webgl-canvas", "");
      slider = (window as SliderWindow).MwSlider?.init(element) ?? undefined;
      if (!slider) setFallback(true);
      else fitPreview();
    };
    void loadRuntime().then(() => {
      if (cancelled) return;
      // The upstream bundle may have initialized this root on script load.
      initialize();
    }).catch(() => { if (!cancelled) setFallback(true); });
    const rebuild = () => { if ((window as SliderWindow).MwSlider) initialize(); };
    preference.addEventListener("change", rebuild);
    window.addEventListener("resize", fitPreview);
    window.addEventListener("scroll", dismissOnScroll, { passive: true });
    element.addEventListener("wheel", dismissOnWheel, { passive: true, capture: true });
    element.addEventListener("touchmove", dismissOnScroll, { passive: true });
    const headerObserver = new ResizeObserver(fitPreview);
    const header = document.querySelector(".prometheus-navbar");
    if (header) headerObserver.observe(header);
    window.visualViewport?.addEventListener("resize", fitPreview);
    const previewObserver = new MutationObserver(syncPreview);
    previewObserver.observe(element, { attributes: true, attributeFilter: ["data-mw-open"] });
    return () => {
      cancelled = true;
      preference.removeEventListener("change", rebuild);
      window.removeEventListener("resize", fitPreview);
      window.removeEventListener("scroll", dismissOnScroll);
      element.removeEventListener("wheel", dismissOnWheel, true);
      element.removeEventListener("touchmove", dismissOnScroll);
      previewObserver.disconnect();
      headerObserver.disconnect();
      window.visualViewport?.removeEventListener("resize", fitPreview);
      (slider ?? element._mw)?.destroy();
    };
  }, [sheets, fallback]);

  if (fallback) return <ShowcaseGallery sheets={sheets} />;
  return (
    <section id="showcase" className="prometheus-showcase prometheus-webflow-showcase" aria-labelledby="showcase-title">
      <div className="webgl_slider_heading_center"><h2 id="showcase-title">#MadeByPrometheus</h2></div>
      <p className="showcase-sr-only" id="webflow-showcase-instructions">Drag or scroll to browse concepts. Use the left and right arrow keys, Enter to open a concept, and Escape to close.</p>
      <div className="prometheus-webflow-stage-slot"><div ref={root} className="prometheus-webflow-stage" data-scroll-span="-3" data-hover-dim="0.65" data-wheel="true" data-hole-x="0" data-hole-y="0" data-hole-w="1" data-hole-h="1" data-fit="contain" data-checker="false" role="group" aria-label="Concept gallery" aria-describedby="webflow-showcase-instructions" tabIndex={0}>
        {sheets.map(sheet => (
          <div key={sheet.id} data-webgl-item="" data-title={sheet.title}>
            <button type="button" className="prometheus-webflow-opener" aria-label={`Preview ${sheet.title}`} />
            <div className="prometheus-webflow-artwork">
              {/* Plain images are texture sources for the vendored renderer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-webgl-image="" src={sheet.image || placeholder(sheet)} alt={sheet.title} width={1400} height={800} loading="eager" draggable={false} />
              <button data-webgl-close="" type="button" aria-label="Close preview" className="prometheus-webflow-close"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" /></svg></button>
            </div>
          </div>
        ))}
      </div></div>
    </section>
  );
}
