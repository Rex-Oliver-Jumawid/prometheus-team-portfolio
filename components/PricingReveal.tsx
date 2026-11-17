"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function PricingReveal({ children, className }: { children: ReactNode; className: string }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;
    let focused = false;

    function paint() {
      frame = undefined;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const viewport = Math.max(1, window.innerHeight);
      const progress = Math.min(1, Math.max(0, (viewport * .95 - rect.top) / (viewport * .8)));
      const open = media.matches || focused ? 1 : progress;
      // A centered ellipse grows until its edges cover all four section corners.
      root.style.setProperty("--pricing-mask-width", `${50 + (rect.width * 1.6 - 50) * open}px`);
      root.style.setProperty("--pricing-mask-height", `${50 + (rect.height * 1.6 - 50) * open}px`);
      root.style.setProperty("--pricing-content-scale", String(.8 + .2 * open));
      root.dataset.revealComplete = String(open >= 1);
      root.dataset.animated = String(!media.matches && !focused);
    }

    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(paint);
    }

    function revealOnFocus() {
      // Tabbing or an assistive-technology action must never focus masked content.
      focused = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      paint();
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    root.addEventListener("focusin", revealOnFocus);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      root.removeEventListener("focusin", revealOnFocus);
      delete root.dataset.animated;
    };
  }, []);

  return <section ref={section} id="pricing" className={`prometheus-pricing ${className}`} aria-labelledby="pricing-title">{children}</section>;
}
