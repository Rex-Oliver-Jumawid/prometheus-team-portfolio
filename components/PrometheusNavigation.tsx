"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";

const links = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

export default function PrometheusNavigation() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);
  const navigation = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 16);
      const footer = document.getElementById("contacts");
      const main = footer?.previousElementSibling;
      if (!footer || !main) { setFooterProgress(0); return; }
      const rect = footer.getBoundingClientRect();
      const revealEdge = Math.max(0, window.innerHeight - rect.height);
      const progress = Math.min(1, Math.max(0, (revealEdge + 180 - main.getBoundingClientRect().bottom) / 180));
      setFooterProgress(navigation.current?.contains(document.activeElement) ? 0 : progress);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 991px)");
    const update = () => {
      setMobile(query.matches);
      if (!query.matches) { setOpen(false); setServicesOpen(false); }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (open) Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []).find(element => element.getClientRects().length > 0)?.focus({ preventScroll: true });
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const closeMenu = () => { setOpen(false); setServicesOpen(false); };
  const goToContacts = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const footer = document.getElementById("contacts");
    const main = footer?.previousElementSibling;
    if (!(main instanceof HTMLElement)) return;
    event.preventDefault();
    // A sticky footer's rectangle is pinned behind the page, so its anchor
    // cannot tell Lenis where the footer actually starts in document flow.
    event.stopPropagation();
    const top = window.scrollY + main.getBoundingClientRect().bottom;
    const request = new window.CustomEvent("prometheus:scroll-to", { detail: top, cancelable: true });
    if (window.dispatchEvent(request)) window.scrollTo({ top, behavior: "instant" });
  };

  return (
    <nav ref={navigation} aria-label="Main navigation" className="navbar prometheus-navbar" style={{ transform: `translateY(-${open ? 0 : footerProgress * 110}%)` }} inert={footerProgress >= 1 && !open} data-scrolled={scrolled} data-menu-open={open} onKeyDown={event => {
      if (event.key === "Escape" && open) {
        closeMenu();
        toggle.current?.focus();
      }
    }}>
      <div className="container is-relative w-container">
        <div className="navbar_main prometheus-nav-inner">
          <Link href="/" aria-label="Prometheus home" className="navbar_logo-wrapper w-inline-block"><span className="prometheus-wordmark">prometheus</span></Link>
          <div className="prometheus-nav-menu-shell" data-open={open}>
          <div id="prometheus-menu" ref={menu} className="prometheus-nav-links" data-open={open} inert={mobile && !open} data-lenis-prevent="">
            {links.map(link => <div className={`prometheus-nav-item${link.label === "Services" ? " is-services" : ""}`} key={link.label}>
              <div className="prometheus-nav-row">
                <a className="prometheus-nav-primary-link" href={link.href} onClick={closeMenu} aria-label={link.label}><span className="prometheus-nav-label-window" aria-hidden="true"><span className="prometheus-nav-label-roll"><span>{link.label}</span><span className="prometheus-nav-label-copy">{link.label}</span></span></span></a>
                {link.label === "Services" && <button type="button" className="prometheus-services-toggle" aria-label={servicesOpen ? "Collapse services" : "Expand services"} aria-expanded={servicesOpen} aria-controls="prometheus-services-submenu" onClick={() => setServicesOpen(value => !value)}><span>Services</span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m3 6 6 6 6-6" stroke="currentColor" strokeWidth="1.6" /></svg></button>}
              </div>
              {link.label === "Services" && <div id="prometheus-services-submenu" className="prometheus-services-submenu" hidden={!servicesOpen}>
                {[
                  ["Websites", "#services-websites"],
                  ["Business Systems", "#services-business-systems"],
                  ["Custom Solutions", "#services-custom-solutions"],
                ].map(([label, href]) => <a href={href} onClick={closeMenu} key={href}>{label}</a>)}
              </div>}
            </div>)}
          </div>
          </div>
          <a href="#contacts" onClick={goToContacts} className="button-cta nav-cta w-inline-block">
            <span className="button_text">Contacts</span>
            <span className="button_arrow-wrapper-2"><span className="code-embed navbar_button-arrow w-embed"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H12M12 7L6.5 1.5M12 7L6.5 12.5" stroke="currentColor" strokeWidth="1.8" /></svg></span></span>
          </a>
          <button ref={toggle} type="button" className="prometheus-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="prometheus-menu" onClick={() => { setOpen(value => !value); setServicesOpen(false); }}>
            <span aria-hidden="true" className="prometheus-burger-line" />
            <span aria-hidden="true" className="prometheus-burger-line" />
          </button>
        </div>
      </div>
    </nav>
  );
}
