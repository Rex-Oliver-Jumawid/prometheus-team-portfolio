import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import ProjectInquiryModule from "../components/ProjectInquiry.tsx";
import { contact } from "../content/contact.ts";
const ProjectInquiry = ProjectInquiryModule.default ?? ProjectInquiryModule;

test("inquiry validates contact details and offers a required budget choice", () => {
  const doc = new JSDOM(renderToStaticMarkup(React.createElement(ProjectInquiry))).window.document;
  const form = doc.querySelector('form');
  assert.equal(form.checkValidity(), false);
  form.elements.name.value = "Visitor Example";
  form.elements.email.value = "invalid";
  form.elements.project.value = "A business website";
  doc.querySelector('input[type=radio]').checked = true;
  assert.equal(form.checkValidity(), false);
  form.elements.email.value = "visitor@example.com";
  assert.equal(form.checkValidity(), true);
});

test("inquiry hands the entered details to the shared calendar in a new tab", async () => {
  const dom = new JSDOM('<div id="root"></div>');
  const saved = new Map();
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, FormData: dom.window.FormData, IS_REACT_ACT_ENVIRONMENT: true })) {
    saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const opened = [];
  window.open = (...args) => { opened.push(args); return null; };
  const root = createRoot(document.querySelector('#root'));
  try {
    await act(async () => root.render(React.createElement(ProjectInquiry)));
    const form = document.querySelector('form');
    form.elements.name.value = 'Visitor & Partner';
    form.elements.email.value = 'visitor@example.com';
    form.elements.project.value = 'Website with booking & inventory';
    document.querySelector('input[type=radio]').checked = true;
    await act(async () => form.requestSubmit());
    assert.equal(opened.length, 1);
    const [url, target, features] = opened[0];
    const booking = new URL(url);
    assert.equal(booking.origin + booking.pathname, contact.meetingUrl);
    assert.equal(booking.searchParams.get('name'), 'Visitor & Partner');
    assert.equal(booking.searchParams.get('email'), 'visitor@example.com');
    assert.match(booking.searchParams.get('notes'), /Budget: Under ₱5,000/);
    assert.match(booking.searchParams.get('notes'), /Website with booking & inventory/);
    assert.equal(target, '_blank');
    assert.equal(features, 'noopener,noreferrer');
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [key, value] of saved) { if (value) Object.defineProperty(globalThis, key, value); else delete globalThis[key]; }
  }
});
