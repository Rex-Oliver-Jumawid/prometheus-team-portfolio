"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ShowcaseSheet } from "../content/showcase";
import { calculateShowcaseLoop, resizePhase, wrapPhase as wrap } from "../lib/showcase-loop";

type Origin = { x: number; y: number; a: number; b: number; c: number; d: number; width: number; height: number };

export default function ShowcaseGallery({ sheets }: { sheets: ShowcaseSheet[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sourceButton = useRef<HTMLButtonElement | null>(null);
  const sourceOrigin = useRef<Origin | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const phase = useRef(0);
  const period = useRef(0);
  const precedingCycles = useRef(2);
  const pitch = useRef(0);
  const initialized = useRef(false);
  const velocity = useRef(0);
  const coasting = useRef(false);
  const wakeMotion = useRef<(() => void) | null>(null);
  const closing = useRef(false);
  const keyboardIndex = useRef(0);
  const drag = useRef<{ id: number; x: number; y: number; lastX: number; lastTime: number; moved: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<ShowcaseSheet | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [copies, setCopies] = useState(4);
  const [keyboardFocused, setKeyboardFocused] = useState(false);

  const paint = useCallback(() => {
    // Keep a complete predecessor cycle to the left even immediately before a
    // wrap, because that left-hand sheet overlaps the first visible sheet.
    if (track.current) track.current.style.transform = `translate3d(${phase.current - period.current * precedingCycles.current}px,0,0)`;
  }, []);

  const keyboardSelect = useCallback((index: number) => {
    keyboardIndex.current = wrap(index, sheets.length);
    const sheet = sheets[keyboardIndex.current];
    const width = stage.current?.clientWidth ?? 0;
    const sheetElement = track.current?.querySelector<HTMLElement>(".showcase-sheet");
    const matrix = new DOMMatrix(sheetElement ? getComputedStyle(sheetElement).transform : undefined);
    const scale = Math.hypot(matrix.m11, matrix.m12, matrix.m13) || 1;
    const activeScale = Number(sheetElement ? getComputedStyle(sheetElement).getPropertyValue("--showcase-active-scale") : 1) || 1;
    const projectedWidth = (sheetElement?.offsetWidth ?? 0) * Math.abs(matrix.a) / scale * activeScale;
    phase.current = wrap(width / 2 - projectedWidth / 2 - keyboardIndex.current * pitch.current, period.current);
    velocity.current = 0;
    coasting.current = false;
    paint();
    setActive(sheet.id);
    setAnnouncement(`${sheet.title}, ${keyboardIndex.current + 1} of ${sheets.length}.`);
  }, [sheets, paint]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const slot = track.current?.querySelector<HTMLElement>(".showcase-slot");
      if (!slot) return;
      const nextCycle = track.current?.children[sheets.length] as HTMLElement | undefined;
      // Measure between repeated cards rather than multiplying a rounded CSS
      // width. Fractional flex positioning must use exactly the rendered period.
      const nextPitch = nextCycle ? (nextCycle.getBoundingClientRect().left - slot.getBoundingClientRect().left) / sheets.length : slot.getBoundingClientRect().width;
      const extent = slot.querySelector<HTMLElement>(".showcase-sheet")?.getBoundingClientRect().width ?? nextPitch;
      const loop = calculateShowcaseLoop(stage.current?.clientWidth ?? 0, nextPitch, sheets.length, extent);
      if (!loop.period) return;
      phase.current = initialized.current ? resizePhase(phase.current, period.current, loop.period) : nextPitch * .38;
      initialized.current = true;
      pitch.current = nextPitch;
      period.current = loop.period;
      precedingCycles.current = loop.precedingCycles;
      setCopies(loop.copies);
      const focused = document.activeElement;
      if (focused === stage.current) {
        keyboardSelect(keyboardIndex.current);
      }
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, [sheets.length, keyboardSelect, paint]);

  useEffect(() => {
    let frame: number | undefined;
    let last = 0;
    let visible = false;
    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, .05) : 0;
      last = time;
      const target = paused || selected || dragging || keyboardFocused ? 0
        : pitch.current * .22;
      // Preserve release velocity, then ease back to the conveyor speed. Time
      // based damping keeps flicks consistent across 60Hz and 120Hz displays.
      if (!dragging) {
        velocity.current += (target - velocity.current) * (1 - Math.exp(-dt * (coasting.current ? 3 : 9)));
        if (Math.abs(target - velocity.current) < 1) coasting.current = false;
      }
      if (!dragging && Math.abs(velocity.current) > .02) {
        phase.current = wrap(phase.current + velocity.current * dt, period.current);
        paint();
      }
      if (target === 0 && Math.abs(velocity.current) < .02) {
        velocity.current = 0;
        frame = undefined;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const refresh = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      last = 0;
      if (visible && !document.hidden && !reducedMotion) frame = requestAnimationFrame(tick);
      else { velocity.current = 0; coasting.current = false; }
    };
    wakeMotion.current = () => {
      if (frame === undefined && visible && !document.hidden && !reducedMotion) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; refresh(); }, { threshold: .01 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      wakeMotion.current = null;
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [paused, active, selected, dragging, reducedMotion, keyboardFocused, paint]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      // Keep pinch-to-zoom and open previews independent from the conveyor.
      if (event.ctrlKey || selected || drag.current?.moved) return;
      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const raw = horizontal && !event.shiftKey ? event.deltaX : event.deltaY || event.deltaX;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const delta = Math.max(-400, Math.min(400, raw * unit));
      if (!delta) return;
      // Horizontal gestures belong to the gallery. Vertical scrolling still
      // moves the page, while lending its momentum to the visible cards.
      if (horizontal && event.cancelable) event.preventDefault();
      setActive(null);
      setKeyboardFocused(false);
      if (reducedMotion) {
        phase.current = wrap(phase.current - delta, period.current);
        velocity.current = 0;
        paint();
        return;
      }
      // Reverse promptly instead of fighting a previous throw. Subsequent
      // samples accumulate in the same time-based damping used for dragging.
      if (Math.sign(velocity.current) === Math.sign(delta)) velocity.current = 0;
      velocity.current = Math.max(-1800, Math.min(1800, velocity.current - delta * 3));
      coasting.current = true;
      wakeMotion.current?.();
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [selected, reducedMotion, paint]);

  function originFor(element: HTMLButtonElement): Origin {
    const rect = element.getBoundingClientRect();
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: rect.left, y: rect.top, a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, width: element.offsetWidth, height: element.offsetHeight };
  }

  function openPreview(sheet: ShowcaseSheet, element: HTMLButtonElement, timeStamp: number) {
    if (timeStamp < suppressClickUntil.current) return;
    sourceButton.current = element;
    keyboardIndex.current = Math.max(0, sheets.findIndex(item => item.id === sheet.id));
    const focused = document.activeElement;
    returnFocus.current = focused instanceof HTMLElement && !focused.closest('[aria-hidden="true"]') && focused !== document.body ? focused : stage.current;
    sourceOrigin.current = originFor(element);
    closing.current = false;
    setPreviewReady(false);
    setSelected(sheet);
  }

  useLayoutEffect(() => {
    if (!selected || !dialog.current || !panel.current) return;
    const modal = dialog.current;
    const preview = panel.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    let cancelled = false;
    setPreviewReady(false);
    modal.showModal();
    modal.focus({ preventScroll: true });
    const bounds = panel.current.getBoundingClientRect();
    const origin = sourceOrigin.current;
    let opening: Animation | undefined;
    if (origin && !reducedMotion) {
      const from = `matrix(${origin.a * origin.width / bounds.width},${origin.b * origin.width / bounds.width},${origin.c * origin.height / bounds.height},${origin.d * origin.height / bounds.height},${origin.x - bounds.x},${origin.y - bounds.y})`;
      opening = panel.current.animate([{ transform: from }, { transform: "matrix(1,0,0,1,0,0)" }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
    }
    const image = preview.querySelector("img");
    // A cached thumbnail may still need decoding at preview size. Keep the
    // controls out of the image's opening motion, including slow image loads.
    const decoded = image?.decode ? image.decode().catch(() => {}) : Promise.resolve();
    void Promise.all([decoded, opening?.finished.catch(() => {})]).then(() => {
      if (cancelled || closing.current) return;
      setPreviewReady(true);
    });
    return () => {
      cancelled = true;
      preview.getAnimations().forEach(animation => animation.cancel());
      modal.close();
      root.style.overflow = previousOverflow;
    };
  }, [selected, reducedMotion]);

  useLayoutEffect(() => {
    if (previewReady && selected && !closing.current) closeButton.current?.focus({ preventScroll: true });
  }, [previewReady, selected]);

  async function closePreview() {
    if (closing.current) return;
    closing.current = true;
    setPreviewReady(false);
    if (panel.current && sourceButton.current?.isConnected && !reducedMotion) {
      const origin = originFor(sourceButton.current);
      const currentTransform = getComputedStyle(panel.current).transform;
      panel.current.getAnimations().forEach(animation => animation.cancel());
      const bounds = panel.current.getBoundingClientRect();
      const target = `matrix(${origin.a * origin.width / bounds.width},${origin.b * origin.width / bounds.width},${origin.c * origin.height / bounds.height},${origin.d * origin.height / bounds.height},${origin.x - bounds.x},${origin.y - bounds.y})`;
      try {
        await panel.current.animate([{ transform: currentTransform }, { transform: target, opacity: .7 }], { duration: 450, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" }).finished;
      } catch { /* Unmount or a changed motion preference cancels the animation. */ }
    }
    dialog.current?.close();
    setSelected(null);
    setActive(null);
    closing.current = false;
    // Keyboard users return to the gallery control, not an offscreen loop copy.
    returnFocus.current?.focus({ preventScroll: true });
  }

  function previewCurrent(timeStamp: number) {
    keyboardSelect(keyboardIndex.current);
    const candidates = Array.from(track.current?.querySelectorAll<HTMLButtonElement>(`[data-sheet-id="${sheets[keyboardIndex.current].id}"]`) ?? []);
    const middle = (stage.current?.getBoundingClientRect().left ?? 0) + (stage.current?.clientWidth ?? 0) / 2;
    candidates.sort((a, b) => Math.abs(a.getBoundingClientRect().left + a.getBoundingClientRect().width / 2 - middle) - Math.abs(b.getBoundingClientRect().left + b.getBoundingClientRect().width / 2 - middle));
    if (candidates[0]) openPreview(sheets[keyboardIndex.current], candidates[0], timeStamp);
  }

  return (
    <section id="showcase" className="prometheus-showcase" aria-labelledby="showcase-title">
      <h2 id="showcase-title">#MadeByPrometheus</h2>
      <p id="showcase-instructions" className="showcase-sr-only">Angled concept gallery. Drag or scroll horizontally, or use the left and right arrow keys. Press Enter to preview a sheet, Space to pause or resume motion, and Escape to close a preview.</p>
      <div ref={stage} className="showcase-stage" tabIndex={0} role="group" aria-label="Concept gallery" aria-describedby="showcase-instructions" data-active={active ?? ""} data-dragging={dragging} data-preview={selected?.id ?? ""}
        onFocus={event => {
          if (event.target !== event.currentTarget) return;
          const keyboard = event.currentTarget.matches(":focus-visible");
          setKeyboardFocused(keyboard);
          if (keyboard && !selected) keyboardSelect(keyboardIndex.current);
        }}
        onPointerLeave={() => {
          if (drag.current && !drag.current.moved) drag.current = null;
          if (!drag.current) setActive(null);
        }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { setActive(null); setKeyboardFocused(false); } }}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); keyboardSelect(keyboardIndex.current + (event.key === "ArrowRight" ? 1 : -1)); }
          if (event.key === "Home" || event.key === "End") { event.preventDefault(); keyboardSelect(event.key === "Home" ? 0 : sheets.length - 1); }
          if (event.key === " ") {
            event.preventDefault();
            if (!event.repeat) {
              setPaused(!paused);
              setAnnouncement(paused ? "Gallery motion resumed." : "Gallery motion paused.");
            }
          }
          if (event.key === "Enter") {
            event.preventDefault();
            previewCurrent(event.timeStamp);
          }
          if (event.key === "Escape") setActive(null);
        }}
        onPointerDown={event => {
          if (event.isPrimary && event.button === 0) {
            coasting.current = false;
            drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastTime: event.timeStamp, moved: false };
          }
        }}
        onPointerMove={event => {
          const pointer = drag.current;
          if (!pointer || pointer.id !== event.pointerId) return;
          const dx = event.clientX - pointer.x;
          if (!pointer.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - pointer.y)) {
            pointer.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            velocity.current = 0;
            setDragging(true);
          }
          if (pointer.moved) {
            if (event.cancelable) event.preventDefault();
            const delta = event.clientX - pointer.lastX;
            const elapsed = Math.max(1, event.timeStamp - pointer.lastTime);
            // Cap anomalous input samples and blend them instead of using one
            // final pointer event as the entire throw velocity.
            const sample = Math.max(-1800, Math.min(1800, delta / elapsed * 1000));
            velocity.current += (sample - velocity.current) * .5;
            phase.current = wrap(phase.current + delta, period.current);
            paint();
          }
          pointer.lastX = event.clientX;
          pointer.lastTime = event.timeStamp;
        }}
        onPointerUp={event => {
          if (drag.current?.moved) {
            suppressClickUntil.current = event.timeStamp + 250;
            coasting.current = !reducedMotion;
            if (event.timeStamp - drag.current.lastTime > 100) velocity.current = 0;
          }
          drag.current = null;
          setDragging(false);
          setActive(null);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { drag.current = null; velocity.current = 0; coasting.current = false; setDragging(false); setActive(null); }}
        onLostPointerCapture={() => {
          // Normal release also emits lostpointercapture; only cancel inertia
          // when capture is lost while a drag is still in progress.
          if (drag.current) { velocity.current = 0; coasting.current = false; }
          drag.current = null; setDragging(false);
        }}>
        <div ref={track} className="showcase-track" aria-hidden="true">
          {Array.from({ length: copies }, (_, copy) => sheets.map((sheet, index) => (
            <div className="showcase-slot" key={`${copy}-${sheet.id}`} style={{ zIndex: sheets.length * copies - (copy * sheets.length + index) }}>
              <button type="button" tabIndex={-1} data-sheet-id={sheet.id} data-lit={active === sheet.id} className={`showcase-sheet tone-${sheet.tone}`} onPointerDown={event => { if (event.pointerType === "mouse") event.preventDefault(); }} onPointerEnter={event => { if (event.pointerType !== "touch" && !drag.current?.moved) setActive(sheet.id); }} onPointerLeave={() => { if (!drag.current?.moved) setActive(null); }} onClick={event => openPreview(sheet, event.currentTarget, event.timeStamp)}>
                <SheetContent sheet={sheet} />
              </button>
            </div>
          )))}
        </div>
      </div>
      <p className="showcase-sr-only" role="status" aria-live="polite">{announcement}</p>
      <dialog ref={dialog} tabIndex={-1} className="showcase-dialog" aria-labelledby="showcase-preview-title" data-lenis-prevent="" onCancel={event => { event.preventDefault(); void closePreview(); }} onClick={event => { if (event.target === event.currentTarget) void closePreview(); }}>
        {selected && <>
          <div className="showcase-preview-frame" data-ready={previewReady}>
          <h3 id="showcase-preview-title" className="showcase-sr-only">{selected.title}</h3>
          <div ref={panel} className={`showcase-preview-panel tone-${selected.tone}`}>
            <SheetContent sheet={selected} />
          </div>
          <button ref={closeButton} type="button" className="showcase-preview-close" aria-label="Close preview" disabled={!previewReady} onClick={() => void closePreview()}><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" /></svg></button>
          </div>
        </>}
      </dialog>
    </section>
  );
}

function SheetContent({ sheet }: { sheet: ShowcaseSheet }) {
  return sheet.image ? <Image src={sheet.image} alt="" width={1400} height={800} unoptimized draggable={false} className="showcase-image" /> : <div className="showcase-blank"><span>{sheet.title}</span><span aria-hidden="true">{sheet.id.slice(-2)}</span></div>;
}

