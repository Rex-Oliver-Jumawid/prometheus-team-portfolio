import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import TeamRevealModule from "../components/TeamReveal.tsx";

const TeamReveal = TeamRevealModule.default ?? TeamRevealModule;

test("team reveal follows scroll in both directions without a skip button and respects live motion changes", async () => {
  const dom = new JSDOM("<div id='root'></div>", { pretendToBeVisual: true });
  const saved = new Map();
  const install = (name, value) => {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  const frames = new Map();
  const listeners = new Set();
  let nextFrame = 0;
  let resize;
  let top = 0;
  let coverHeight = 0;
  const media = { matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  install("window", dom.window);
  install("document", dom.window.document);
  install("IS_REACT_ACT_ENVIRONMENT", true);
  install("requestAnimationFrame", callback => { frames.set(++nextFrame, callback); return nextFrame; });
  install("cancelAnimationFrame", id => frames.delete(id));
  install("ResizeObserver", class {
    constructor(fn) { resize = { callback: fn, disconnected: false }; }
    observe() {}
    disconnect() { resize.disconnected = true; }
  });
  dom.window.matchMedia = () => media;
  Object.defineProperty(dom.window, "innerHeight", { value: 800 });
  Object.defineProperty(dom.window, "scrollY", { get: () => 2000 - top });
  dom.window.HTMLElement.prototype.getBoundingClientRect = function () { return { top, height: this.classList.contains("team-cover-face") ? coverHeight : 0 }; };
  Object.defineProperty(dom.window.HTMLElement.prototype, "offsetHeight", { get: () => 1200 });
  let scrollTarget;
  dom.window.scrollTo = options => { scrollTarget = options; top = 2000 - options.top; };
  const flush = () => { for (const [id, fn] of [...frames]) { frames.delete(id); fn(); } };
  const root = createRoot(document.querySelector("#root"));
  try {
    await act(async () => root.render(React.createElement(TeamReveal, null, React.createElement("h2", { id: "team-title", tabIndex: -1 }, "Team"))));
    const section = document.querySelector("#about");
    assert.equal(document.querySelector(".team-reveal-skip"), null);
    assert.equal(section.dataset.animated, "true");
    assert.equal(section.style.getPropertyValue("--team-height"), "1200px");
    assert.equal(section.style.getPropertyValue("--team-open"), "0");
    top = -400;
    window.dispatchEvent(new window.Event("scroll"));
    window.dispatchEvent(new window.Event("scroll"));
    assert.equal(frames.size, 1, "scroll work is coalesced into one frame");
    flush();
    assert.ok(Number(section.style.getPropertyValue("--team-open")) > .5);
    top = -800;
    window.dispatchEvent(new window.Event("scroll")); flush();
    assert.equal(section.dataset.revealed, "true");
    coverHeight = 480;
    top = -240;
    window.dispatchEvent(new window.Event("resize")); flush();
    assert.equal(section.style.getPropertyValue("--team-distance"), "480px");
    assert.ok(Number(section.style.getPropertyValue("--team-open")) > .5);
    top = -480;
    window.dispatchEvent(new window.Event("scroll")); flush();
    assert.equal(section.dataset.revealed, "true", "compact phone cover finishes within its own height");
    top = 100;
    window.dispatchEvent(new window.Event("scroll")); flush();
    assert.equal(section.dataset.revealed, "false");
    assert.equal(section.style.getPropertyValue("--team-open"), "0");
    media.matches = true;
    for (const listener of listeners) listener();
    assert.equal(section.dataset.animated, "false");
    media.matches = false;
    for (const listener of listeners) listener();
    assert.equal(section.dataset.animated, "true");
    resize.callback();
    assert.equal(frames.size, 1);
    await act(async () => root.unmount());
    assert.equal(frames.size, 0);
    assert.equal(listeners.size, 0);
    assert.equal(resize.disconnected, true);
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
