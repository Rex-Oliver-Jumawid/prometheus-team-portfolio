import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import PricingRevealModule from "../components/PricingReveal.tsx";

const PricingReveal = PricingRevealModule.default ?? PricingRevealModule;

test("pricing ellipse follows scroll, handles motion changes and focus, and cleans up pending work", async () => {
  const dom = new JSDOM("<div id='root'></div>", { pretendToBeVisual: true });
  const saved = new Map();
  const install = (name, value) => {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  const frames = new Map();
  const listeners = new Set();
  let next = 0;
  let top = 1000;
  let resize;
  const media = { matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  install("window", dom.window);
  install("document", dom.window.document);
  install("IS_REACT_ACT_ENVIRONMENT", true);
  install("requestAnimationFrame", fn => { frames.set(++next, fn); return next; });
  install("cancelAnimationFrame", id => frames.delete(id));
  install("ResizeObserver", class {
    constructor(fn) { resize = { callback: fn, disconnected: false }; }
    observe() {}
    disconnect() { resize.disconnected = true; }
  });
  dom.window.matchMedia = () => media;
  Object.defineProperty(dom.window, "innerHeight", { value: 800 });
  dom.window.HTMLElement.prototype.getBoundingClientRect = () => ({ top, width: 1200, height: 1100 });
  const flush = () => { for (const [id, fn] of [...frames]) { frames.delete(id); fn(); } };
  const root = createRoot(document.querySelector("#root"));
  try {
    await act(async () => root.render(React.createElement(PricingReveal, { className: "test-font" }, React.createElement("a", { href: "#contacts" }, "Start a project"))));
    const section = document.querySelector("#pricing");
    assert.equal(section.dataset.animated, "true");
    assert.equal(section.dataset.revealComplete, "false");
    assert.equal(section.style.getPropertyValue("--pricing-mask-width"), "50px");
    top = 400;
    window.dispatchEvent(new window.Event("scroll"));
    window.dispatchEvent(new window.Event("scroll"));
    assert.equal(frames.size, 1);
    flush();
    assert.ok(parseFloat(section.style.getPropertyValue("--pricing-mask-width")) > 50);
    assert.equal(section.dataset.revealComplete, "false");
    top = 0;
    window.dispatchEvent(new window.Event("scroll")); flush();
    assert.equal(section.dataset.revealComplete, "true");
    assert.equal(section.style.getPropertyValue("--pricing-content-scale"), "1");
    top = 1000;
    window.dispatchEvent(new window.Event("scroll")); flush();
    assert.equal(section.dataset.revealComplete, "false");
    media.matches = true;
    for (const fn of listeners) fn();
    flush();
    assert.equal(section.dataset.animated, "false");
    assert.equal(section.dataset.revealComplete, "true");
    media.matches = false;
    for (const fn of listeners) fn();
    flush();
    assert.equal(section.dataset.revealComplete, "false");
    resize.callback();
    assert.equal(frames.size, 1);
    document.querySelector("a").focus();
    assert.equal(section.dataset.revealComplete, "true", "keyboard focus immediately reveals the entire section");
    assert.equal(section.dataset.animated, "false");
    assert.equal(frames.size, 0, "focus cancels a queued scroll/resize paint");
    resize.callback();
    await act(async () => root.unmount());
    assert.equal(frames.size, 0);
    assert.equal(resize.disconnected, true);
    assert.equal(listeners.size, 0);
    window.dispatchEvent(new window.Event("scroll"));
    assert.equal(frames.size, 0);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
