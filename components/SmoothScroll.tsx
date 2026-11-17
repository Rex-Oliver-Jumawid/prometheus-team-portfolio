"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame: number | undefined;

    function stop() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      lenis?.destroy();
      lenis = undefined;
    }

    function configure() {
      stop();
      if (reducedMotion.matches) return;

      // Same interpolation and wheel multiplier as the supplied live-site capture.
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        infinite: false,
        anchors: true,
        easing: (t: number) => t * (2 - t),
      });

      function animate(time: number) {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      }
      frame = requestAnimationFrame(animate);
    }

    function scrollToRequestedPosition(event: Event) {
      const detail = (event as CustomEvent<number | { top: number; behavior: "smooth" }>).detail;
      const top = typeof detail === "number" ? detail : detail?.top;
      if (!Number.isFinite(top)) return;
      event.preventDefault();
      const smooth = typeof detail !== "number" && detail.behavior === "smooth" && !reducedMotion.matches;
      if (lenis && smooth) {
        const distance = Math.abs(top - window.scrollY);
        lenis.scrollTo(top, {
          duration: Math.min(2.2, Math.max(.7, distance / window.innerHeight * .16)),
          easing: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        });
      } else if (lenis) {
        // Focus-driven reveals must also cancel an in-flight smooth navigation.
        lenis.scrollTo(top, { immediate: true, force: true });
      } else window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
    }

    configure();
    window.addEventListener("prometheus:scroll-to", scrollToRequestedPosition);
    reducedMotion.addEventListener("change", configure);
    return () => {
      reducedMotion.removeEventListener("change", configure);
      window.removeEventListener("prometheus:scroll-to", scrollToRequestedPosition);
      stop();
    };
  }, []);

  return null;
}
