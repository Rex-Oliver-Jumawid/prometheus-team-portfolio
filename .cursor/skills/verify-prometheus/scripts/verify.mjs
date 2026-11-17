#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const [feature, ...flags] = process.argv.slice(2);
const journeys = { clients, navigation, work, pricing, team, faq };
if (!Object.hasOwn(journeys, feature) || flags.some(flag => !["--mobile", "--reduced-motion"].includes(flag))) {
  console.error("Usage: node .cursor/skills/verify-prometheus/scripts/verify.mjs <clients|navigation|work|pricing|team|faq> [--mobile] [--reduced-motion]");
  process.exit(1);
}
const viewport = flags.includes("--mobile") ? { width: 390, height: 844 } : { width: 1440, height: 1000 };
const evidence = join(root, ".verification", `${new Date().toISOString().replace(/[:.]/g, "-")}-${feature}`);
await mkdir(evidence, { recursive: true });
const buildId = (await readFile(join(root, ".next/BUILD_ID"), "utf8")).trim();
const report = { feature, flags, viewport, buildId, head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), status: "running", actions: [], diagnostics: [] };
let server;
let browser;
let context;
let page;
let serverLog = "";
let step = 0;

async function capture(action) {
  report.actions.push(action);
  const name = `${String(++step).padStart(2, "0")}-${action.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime));
    await Promise.all(finite.map(animation => animation.finished.catch(() => {})));
  });
  await page.screenshot({ path: join(evidence, `${name}.png`) });
  await writeFile(join(evidence, `${name}.aria.yml`), await page.locator("body").ariaSnapshot());
}

async function doctor(base) {
  assert.equal(server.exitCode, null, "Owned server exited");
  const response = await fetch(`${base}/`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Prometheus \| Websites &amp; Business Systems Philippines/);
  await writeFile(join(evidence, "doctor.json"), JSON.stringify({ base, pid: server.pid, buildId, status: response.status }, null, 2));
}

async function clients() {
  const row = page.locator(".prometheus-partners");
  await row.scrollIntoViewIfNeeded();
  await expect(page.getByText("Clients we're working with", { exact: true })).toBeVisible();
  await expect(row.getByRole("img")).toHaveCount(3);
  const logo = row.getByRole("img", { name: "ABG Studios", exact: true });
  const neutral = logo.locator(".prometheus-partner-neutral");
  const color = logo.locator(".prometheus-partner-color");
  for (const image of await row.locator("img").all()) {
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await expect(neutral).toHaveCSS("opacity", "1");
  await capture("Three client logos with centered cream ABG Studios portrait");
  await logo.hover();
  await expect(neutral).toHaveCSS("opacity", "0");
  await expect(color).toHaveCSS("clip-path", "circle(75% at 50% 50%)");
  await capture("Hover reveals metallic ABG Studios artwork");
  await page.mouse.move(0, 0);
  await expect(neutral).toHaveCSS("opacity", "1");
  await row.getByRole("img", { name: "Piercing Corner", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(logo).toBeFocused();
  await expect(neutral).toHaveCSS("opacity", "0");
  await capture("Keyboard focus reveals metallic ABG Studios artwork");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

async function navigation() {
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  if (flags.includes("--mobile")) {
    await nav.getByRole("button", { name: "Open menu" }).click();
    await expect(nav.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await capture("Open mobile menu");
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("button", { name: "Open menu" })).toBeFocused();
    await nav.getByRole("button", { name: "Open menu" }).click();
    await nav.getByRole("button", { name: "Expand services" }).click();
    await capture("Expand services submenu");
    await nav.getByRole("link", { name: "Websites", exact: true }).click();
    await expect(nav.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  } else {
    await nav.getByRole("link", { name: "Services", exact: true }).click();
  }
  const summary = page.locator("#services-websites summary").filter({ hasText: "Landing Pages" });
  await summary.click();
  await expect(page.locator("#services-websites details[open]")).toContainText("Focused pages that introduce an offer");
  await capture("Open Landing Pages description");
  await summary.press("Enter");
  await expect(page.locator("#services-websites details[open]")).toHaveCount(0);
}

async function pricing() {
  await expect(page.locator("#pricing .pricing-build-first")).toHaveCount(0);
  const selector = page.getByRole("radiogroup", { name: "Pricing options" });
  await selector.scrollIntoViewIfNeeded();
  const business = page.getByRole("region", { name: "Business pricing", exact: true });
  await expect(business.getByRole("article")).toHaveCount(2);
  await expect(business).toContainText("₱14,999");
  const alignment = await business.locator(".pricing-plans").evaluate(el => ({ panel: el.getBoundingClientRect().left, container: el.closest(".pricing-container").getBoundingClientRect().left }));
  assert.ok(Math.abs(alignment.panel - alignment.container) < 2);
  await capture("Business prototype offer");
  await expect(business.locator("details")).toHaveCount(0);
  await expect(business.getByRole("article", { name: "Custom Business System" })).toHaveClass(/pricing-plan-featured/);
  const maintenance = business.getByRole("article", { name: "Maintenance & Warranty" });
  for (const type of ["Corrective", "Perfective", "Adaptive", "Preventive"]) await expect(maintenance).toContainText(`${type} maintenance`);
  await expect(business).toContainText("50% before development");
  await maintenance.scrollIntoViewIfNeeded();
  await capture("Business maintenance panel");
  await selector.getByRole("radio", { name: "Personal", exact: true }).click();
  const personal = page.getByRole("region", { name: "Personal pricing", exact: true });
  await expect(personal.getByRole("article")).toHaveCount(2);
  await expect(personal).toContainText("₱2,499");
  await expect(personal).toContainText("₱4,999");
  await capture("Personal portfolios");
  await personal.locator("summary").click();
  assert.ok(await personal.locator("details p").evaluateAll(elements => elements.every(el => Math.abs(el.getBoundingClientRect().width - el.parentElement.clientWidth) < 2)));
  await expect(personal.locator("details[open]")).toContainText("₱500/year");
  await expect(personal.locator("details[open]")).toContainText("promths.com");
  await capture("Personal hosting renewal terms");
  await selector.getByRole("radio", { name: "Personal", exact: true }).press("ArrowRight");
  const student = page.getByRole("region", { name: "Student pricing", exact: true });
  await expect(selector.getByRole("radio", { name: "Student", exact: true })).toBeFocused();
  await expect(student.getByRole("article")).toHaveCount(3);
  await expect(student).toContainText("₱8,999");
  await expect(student).toContainText("₱10,999");
  await capture("Student project options");
  await student.locator("summary").click();
  assert.ok(await student.locator("details p").evaluateAll(elements => elements.every(el => Math.abs(el.getBoundingClientRect().width - el.parentElement.clientWidth) < 2)));
  await expect(student.locator("details[open]")).toContainText("Google Forms");
  await capture("Student evaluation responsibilities");
  for (const audience of ["Personal", "Student", "Business"]) {
    await selector.getByRole("radio", { name: audience, exact: true }).click();
    const region = page.getByRole("region", { name: `${audience} pricing`, exact: true });
    for (const link of await region.getByRole("link").all()) {
      await expect(link).toHaveAttribute("href", "https://cal.com/rex-oliver-jumawid-mmz8ct/project-consultation");
      await expect(link).toHaveAttribute("target", "_blank");
    }
  }
  await selector.getByRole("radio", { name: "Business", exact: true }).press("Home");
  await expect(selector.getByRole("radio", { name: "Personal", exact: true })).toHaveAttribute("aria-checked", "true");
  await selector.getByRole("radio", { name: "Personal", exact: true }).press("End");
  await expect(selector.getByRole("radio", { name: "Business", exact: true })).toHaveAttribute("aria-checked", "true");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

async function faq() {
  const first = page.locator("#faq details").filter({ hasText: "Is it really free to get started?" });
  const second = page.locator("#faq details").filter({ hasText: "What if I don't like what you've built?" });
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator("p")).toBeVisible();
  await expect(first).toContainText("Student work requires a 50% payment");
  await capture("Open free-start answer");
  await second.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(second).toHaveAttribute("open", "");
  await capture("Two FAQ answers stay open independently");
  await first.locator("summary").press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
  await expect(second).toHaveAttribute("open", "");
  const last = page.locator("#faq summary").last();
  await last.focus();
  await page.keyboard.press("Tab");
  const email = page.getByRole("link", { name: "Email prometheus.exps@gmail.com" });
  await expect(email).toBeFocused();
  await expect(email).toBeInViewport();
  await expect(email).toHaveAttribute("href", "mailto:prometheus.exps@gmail.com");
  await capture("Tab from FAQ reveals contact email");
}

async function team() {
  const heading = page.getByRole("heading", { name: "Meet the team behind Prometheus" });
  await heading.scrollIntoViewIfNeeded();
  await expect(page.getByRole("list", { name: "Prometheus team" }).getByRole("listitem")).toHaveCount(3);
  await expect(heading).toBeInViewport();
  await capture("Scroll to three team profiles");
}

async function work() {
  await page.locator("#works").scrollIntoViewIfNeeded();
  await expect(page.locator("#works article")).toHaveCount(2);
  await capture("Reach both case studies");
  const gallery = page.getByRole("group", { name: "Concept gallery" });
  await gallery.scrollIntoViewIfNeeded();
  await page.locator("#showcase .showcase-stage, #showcase [data-mw-init]").first().waitFor();
  report.galleryRenderer = await page.locator("#showcase .showcase-stage").count() ? "fallback" : "hardware-webgl";
  await gallery.focus();
  await gallery.press("ArrowRight");
  await capture("Browse next concept with ArrowRight");
  await gallery.press("Enter");
  const close = page.getByRole("button", { name: "Close preview", exact: true });
  await expect(close).toBeVisible();
  await expect(close).toBeEnabled({ timeout: 15000 });
  await capture("Open concept preview with Enter");
  await page.keyboard.press("Escape");
  await expect(close).not.toBeVisible();
  await capture("Escape dismisses concept preview");
}

try {
  server = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "0"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  const base = await new Promise((resolveBase, reject) => {
    const timer = setTimeout(() => reject(new Error("Server readiness timed out; inspect server.log")), 30000);
    const finish = (error, value) => {
      clearTimeout(timer);
      if (error) reject(error);
      else resolveBase(value);
    };
    const append = chunk => {
      serverLog += chunk.toString();
      const address = serverLog.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (address && /Ready in/.test(serverLog)) finish(null, address);
    };
    server.stdout.on("data", append);
    server.stderr.on("data", append);
    server.once("error", error => finish(error));
    server.once("exit", code => finish(new Error(`Server exited: ${code}`)));
  });
  report.base = base;
  await doctor(base);
  browser = await chromium.launch();
  context = await browser.newContext({ viewport, reducedMotion: flags.includes("--reduced-motion") ? "reduce" : "no-preference" });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  page = await context.newPage();
  page.on("console", message => { if (message.type() === "error") report.diagnostics.push({ type: "console", message: message.text() }); });
  page.on("pageerror", error => report.diagnostics.push({ type: "pageerror", message: error.message }));
  page.on("response", response => { if (response.status() >= 400) report.diagnostics.push({ type: "http", status: response.status(), url: response.url() }); });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await expect(page).toHaveTitle("Prometheus | Websites & Business Systems Philippines");
  await capture("Load Prometheus");
  await journeys[feature]();
  assert.equal(report.diagnostics.filter(item => item.type === "pageerror").length, 0, "Uncaught browser errors; inspect report.json");
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack;
  if (page && !page.isClosed()) await capture("Failure state").catch(() => {});
  process.exitCode = 1;
} finally {
  if (context) await context.tracing.stop({ path: join(evidence, "trace.zip") }).catch(() => {});
  if (browser) await browser.close();
  if (server && server.exitCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    const force = setTimeout(() => server.kill("SIGKILL"), 5000);
    await exited;
    clearTimeout(force);
  }
  report.serverStopped = !server || server.exitCode !== null || server.signalCode !== null;
  await writeFile(join(evidence, "server.log"), serverLog);
  await writeFile(join(evidence, "report.json"), JSON.stringify(report, null, 2));
  console.log(`${report.status}: ${evidence}`);
}
