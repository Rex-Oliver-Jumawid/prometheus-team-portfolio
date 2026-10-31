"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function TeamReveal({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const panel = stage.current;
    if (!root || !panel) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    function paint() {
      frame = undefined;
      if (!root || !panel) return;
      // Match the scroll travel to the rendered cover, including its compact phone layout.
      const cover = root.querySelector<HTMLElement>(".team-cover-face");
      const distance = cover?.getBoundingClientRect().height || window.innerHeight;
      root.style.setProperty("--team-height", `${panel.offsetHeight}px`);
      root.style.setProperty("--team-distance", `${distance}px`);
      // Hold briefly at either end, then slide both halves completely offscreen.
      const progress = Math.min(1, Math.max(0, (-root.getBoundingClientRect().top / distance - .08) / .82));
      root.style.setProperty("--team-open", String(progress));
      root.dataset.revealed = String(progress >= 1);
    }

    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(paint);
    }

    function configure() {
      if (!root) return;
      root.dataset.animated = String(!media.matches);
      paint();
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(panel);
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", configure);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", configure);
      delete root.dataset.animated;
    };
  }, []);

  return (
    <section id="about" ref={section} className="prometheus-team" aria-labelledby="team-title">
      <div ref={stage} className="team-sticky">
        {children}
        <div className="team-cover" aria-hidden="true">
          <div className="team-cover-half team-cover-left"><div className="team-cover-face"><span>Team</span></div></div>
          <div className="team-cover-half team-cover-right"><div className="team-cover-face"><span>Team</span></div></div>
        </div>
      </div>
    </section>
  );
}
