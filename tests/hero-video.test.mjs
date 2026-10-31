import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import HeroModule from "../components/Hero.tsx";
import HeroVideoModule from "../components/HeroVideo.tsx";
const Hero = HeroModule.default ?? HeroModule;
const HeroVideo = HeroVideoModule.default ?? HeroVideoModule;

test("Prometheus hero exposes a keyboard play button connected to the bundled demo", () => {
  const doc = new JSDOM(renderToStaticMarkup(React.createElement(Hero, { brand: "prometheus" }))).window.document;
  assert.equal(doc.querySelector('[data-play-demo]').tagName, 'BUTTON');
});

test("video opens only on Play, releases media on close, restores focus and recovers from missing media", async () => {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
  const saved = new Map();
  for (const [key, value] of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true})) {
    saved.set(key, Object.getOwnPropertyDescriptor(globalThis,key));
    Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  }
  dom.window.HTMLDialogElement.prototype.showModal = function(){ this.open = true; };
  dom.window.HTMLDialogElement.prototype.close = function(){ this.open = false; this.dispatchEvent(new window.Event('close')); };
  const root = createRoot(document.querySelector('#root'));
  try {
    await act(async () => root.render(React.createElement(HeroVideo, { videoSrc:'/videos/demo.mp4' }, React.createElement('button', {'data-play-demo':true}, 'Play'))));
    const trigger = document.querySelector('button');
    assert.equal(document.querySelector('video'), null);
    await act(async () => trigger.click());
    assert.equal(document.querySelector('dialog').open, true);
    assert.equal(document.querySelector('video').getAttribute('src'), '/videos/demo.mp4');
    assert.equal(document.body.style.overflow, 'hidden');
    await act(async () => document.querySelector('[aria-label="Close video"]').click());
    assert.equal(document.querySelector('video'), null);
    assert.equal(document.body.style.overflow, '');
    assert.equal(document.activeElement, trigger);
    await act(async () => trigger.click());
    await act(async () => document.querySelector('video').dispatchEvent(new window.Event('error')));
    assert.match(document.querySelector('dialog').textContent, /unavailable/);
    await act(async () => root.unmount());
    assert.equal(document.body.style.overflow, '');
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for(const [key,value] of saved) { if(value) Object.defineProperty(globalThis,key,value); else delete globalThis[key]; }
  }
});
