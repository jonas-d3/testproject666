import { chromium } from "playwright";
import axe from "axe-core";
import fs from "node:fs/promises";
import path from "node:path";

const url = "http://127.0.0.1:5173/";
const outDir = "/Users/holbech/Documents/testproject666/a11y-reports/main/127.0.0.1:5173/20260622-205401";
const screenshotsDir = path.join(outDir, "screenshots");

async function snapshotPage(page, viewportName) {
  const buttons = await page.locator("button").evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent?.trim(),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }),
  );
  const links = await page.locator("a").evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent?.trim(),
        href: el.getAttribute("href"),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }),
  );
  const headings = await page.locator("h1,h2,h3").evaluateAll((els) =>
    els.map((el) => ({ tag: el.tagName, text: el.textContent?.trim() })),
  );
  const landmarks = await page.locator("main,header,nav,section").evaluateAll((els) =>
    els.map((el) => ({ tag: el.tagName, id: el.id || null, label: el.getAttribute("aria-label") || null })),
  );
  return { viewportName, buttons, links, headings, landmarks };
}

async function keyboardPass(page, tabs = 12) {
  await page.keyboard.press("Home");
  const sequence = [];
  for (let i = 0; i < tabs; i += 1) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(80);
    sequence.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        const rect = el?.getBoundingClientRect();
        const styles = el ? getComputedStyle(el) : null;
        return {
          tag: el?.tagName,
          text: el?.textContent?.trim(),
          href: el?.getAttribute?.("href"),
          outline: styles?.outline,
          boxShadow: styles?.boxShadow,
          rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
        };
      }),
    );
  }
  return sequence;
}

async function runViewport(browser, viewportName, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: "networkidle" });
  const axeResults = await page.evaluate((source) => {
    window.eval(source);
    return window.axe.run(document);
  }, axe.source);
  const snapshot = await snapshotPage(page, viewportName);
  const keyboard = await keyboardPass(page, viewportName === "desktop" ? 12 : 8);
  async function addOverlay(locator, label) {
    const box = await locator.boundingBox();
    await page.evaluate(({ box, label }) => {
      document.querySelectorAll("[data-audit-overlay]").forEach((el) => el.remove());
      if (!box) return;
      const rect = document.createElement("div");
      rect.setAttribute("data-audit-overlay", "true");
      Object.assign(rect.style, {
        position: "absolute",
        left: `${box.x + window.scrollX}px`,
        top: `${box.y + window.scrollY}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        border: "4px solid #ef4444",
        zIndex: "2147483647",
        pointerEvents: "none",
      });
      const text = document.createElement("div");
      text.setAttribute("data-audit-overlay", "true");
      text.textContent = label;
      Object.assign(text.style, {
        position: "absolute",
        left: `${box.x + window.scrollX}px`,
        top: `${Math.max(4, box.y + window.scrollY - 30)}px`,
        padding: "2px 6px",
        background: "#ef4444",
        color: "white",
        font: "700 16px sans-serif",
        zIndex: "2147483647",
        pointerEvents: "none",
      });
      document.body.append(rect, text);
    }, { box, label });
  }
  async function clearOverlay() {
    await page.evaluate(() => document.querySelectorAll("[data-audit-overlay]").forEach((el) => el.remove()));
  }

  const startSprint = page.locator("button", { hasText: "Start a sprint" });
  const viewServices = page.locator("button", { hasText: "View services" });
  await startSprint.focus();
  await addOverlay(startSprint, "CTA has no action");
  await page.screenshot({ path: path.join(screenshotsDir, `${viewportName}-start-sprint-focus-annotated.png`), fullPage: true });
  await clearOverlay();
  await startSprint.hover();
  await addOverlay(startSprint, "CTA has no action");
  await page.screenshot({ path: path.join(screenshotsDir, `${viewportName}-start-sprint-hover-annotated.png`), fullPage: true });
  await clearOverlay();
  await viewServices.focus();
  await addOverlay(viewServices, "Looks interactive but no action");
  await page.screenshot({ path: path.join(screenshotsDir, `${viewportName}-view-services-focus-annotated.png`), fullPage: true });
  await clearOverlay();
  await viewServices.hover();
  await addOverlay(viewServices, "Looks interactive but no action");
  await page.screenshot({ path: path.join(screenshotsDir, `${viewportName}-view-services-hover-annotated.png`), fullPage: true });
  await clearOverlay();
  const before = await page.evaluate(() => location.hash);
  await page.locator("button", { hasText: "View services" }).click();
  await page.waitForTimeout(300);
  const afterViewServicesClick = await page.evaluate(() => ({ hash: location.hash, scrollY }));
  await page.locator("button", { hasText: "Start a sprint" }).click();
  await page.waitForTimeout(300);
  const afterStartSprintClick = await page.evaluate(() => ({ hash: location.hash, scrollY }));
  await page.close();
  return {
    viewportName,
    viewport,
    axeResults,
    snapshot,
    keyboard,
    before,
    afterViewServicesClick,
    afterStartSprintClick,
  };
}

await fs.mkdir(screenshotsDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const desktop = await runViewport(browser, "desktop", { width: 1440, height: 900 });
const mobile = await runViewport(browser, "mobile", { width: 390, height: 844 });
await browser.close();

await fs.writeFile(
  path.join(outDir, "audit-data.json"),
  JSON.stringify({ desktop, mobile }, null, 2),
);

console.log(JSON.stringify({
  desktopViolations: desktop.axeResults.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
  mobileViolations: mobile.axeResults.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
  desktopButtons: desktop.snapshot.buttons.map((b) => b.text),
  mobileButtons: mobile.snapshot.buttons.map((b) => b.text),
  desktopKeyboard: desktop.keyboard,
  mobileKeyboard: mobile.keyboard,
  clickResults: {
    desktopViewServices: desktop.afterViewServicesClick,
    desktopStartSprint: desktop.afterStartSprintClick,
    mobileViewServices: mobile.afterViewServicesClick,
    mobileStartSprint: mobile.afterStartSprintClick,
  },
}, null, 2));
