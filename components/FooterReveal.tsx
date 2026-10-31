"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function FooterReveal({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = footer.current;
    const main = root?.previousElementSibling;
    if (!root || !(main instanceof HTMLElement)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    function update() {
      frame = undefined;
      if (!root || !(main instanceof HTMLElement)) return;
      root.style.setProperty("--footer-stick-bottom", `${Math.min(0, window.innerHeight - root.offsetHeight)}px`);
      // Read the natural page edge: the sticky footer's own rectangle is pinned.
      const progress = Math.min(1, Math.max(0, (window.innerHeight - main.getBoundingClientRect().bottom) / Math.max(1, root.offsetHeight)));
      root.style.setProperty("--footer-reveal-offset", `${media.matches ? 0 : 40 * (1 - progress)}px`);
    }
    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(update);
    }
    function revealFocusedLink() {
      if (!root || !(main instanceof HTMLElement)) return;
      // Keyboard navigation can focus a sticky link while the foreground page
      // still covers it. Reveal the drawer without changing keyboard focus.
      if (main.getBoundingClientRect().bottom <= root.getBoundingClientRect().top + 1) return;
      const top = window.scrollY + main.getBoundingClientRect().bottom + root.offsetHeight - window.innerHeight;
      const request = new window.CustomEvent("prometheus:scroll-to", { detail: top, cancelable: true });
      if (window.dispatchEvent(request)) window.scrollTo({ top, behavior: "instant" });
      schedule();
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    resize.observe(main);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    root.addEventListener("focusin", revealFocusedLink);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      root.removeEventListener("focusin", revealFocusedLink);
    };
  }, []);

  return <footer ref={footer} id="contacts" className="prometheus-editorial-footer" aria-label="Prometheus footer">{children}</footer>;
}
