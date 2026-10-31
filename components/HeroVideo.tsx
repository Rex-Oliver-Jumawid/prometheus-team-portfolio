"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function HeroVideo({ children, videoSrc }: { children: ReactNode; videoSrc: string | null }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return <div onClick={event => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-play-demo]");
    if (button) { trigger.current = button; setFailed(false); setOpen(true); }
  }}>
    {children}
    {open && <dialog ref={dialog} className="prometheus-video-dialog" aria-label="Furniture Odyssey demo" data-lenis-prevent="" onClose={() => setOpen(false)} onClick={event => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }}>
      <div className="prometheus-video-panel">
        <button type="button" className="prometheus-video-close" onClick={() => dialog.current?.close()} aria-label="Close video">×</button>
        {videoSrc && !failed ? <video controls autoPlay playsInline preload="metadata" onError={() => setFailed(true)} src={videoSrc} /> : <p>The demo video is unavailable. Please try again later.</p>}
      </div>
    </dialog>}
  </div>;
}
