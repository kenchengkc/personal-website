import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

// Run against a production server; keep compositor capture separate from timings.
// node scripts/profile-brain-startup.mjs /tmp/brain-audit [CPU slowdown, default 4]
const output = resolve(process.argv[2] ?? "/tmp/brain-audit");
const slowdown = Number(process.argv[3] ?? 4);
const traceTiles = process.env.AUDIT_TILES === "1";
const url = process.env.AUDIT_URL ?? "http://localhost:3001";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 2 });
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  await client.send("Emulation.setCPUThrottlingRate", { rate: slowdown });
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 80, downloadThroughput: 1250000, uploadThroughput: 1250000 });
  await page.addInitScript(({ traceTiles }) => {
    const audit = window.brainAudit = { frames: [], paints: [], longTasks: [], shifts: [], jumps: [], setupStart: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) audit.longTasks.push({ t: entry.startTime, duration: entry.duration }); }).observe({ type: "longtask", buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) audit.shifts.push({ t: entry.startTime, value: entry.value }); }).observe({ type: "layout-shift", buffered: true });
    let last = 0;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      if (this.classList.contains("hero-brain-canvas") && !audit.setupStart) audit.setupStart = performance.now();
      return Reflect.apply(originalGetContext, this, args);
    };
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    let paint;
    let previousPositions = new Map();
    let currentPositions = new Map();
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains("hero-brain-canvas")) {
        previousPositions = currentPositions;
        currentPositions = new Map();
        paint = { t: performance.now(), draws: 0, phase: document.querySelector(".hero-binary-art")?.dataset.phase };
        audit.paints.push(paint);
      }
      return Reflect.apply(clear, this, args);
    };
    if (traceTiles) CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
      if (this.canvas.classList.contains("hero-brain-canvas") && paint) {
        paint.draws++;
        const key = args.length === 4 ? source : `${args[0]}:${args[1]}`;
        const y = args.length === 4 ? args[1] : args[5];
        const previousY = previousPositions.get(key);
        if (previousY !== undefined && Math.abs(y - previousY) > 40 && audit.jumps.length < 1000) audit.jumps.push({ t: performance.now(), from: previousY, to: y, phase: paint.phase });
        currentPositions.set(key, y);
      }
      return Reflect.apply(draw, this, [source, ...args]);
    };
    function sample(time) {
      const art = document.querySelector(".hero-binary-art");
      const canvas = document.querySelector(".hero-brain-canvas");
      const poster = document.querySelector(".hero-brain-poster");
      if (art && canvas && poster) {
        audit.frames.push({ t: performance.now(), rafTime: time, dt: last ? time - last : 0, phase: art.dataset.phase, ready: art.dataset.ready, artY: art.getBoundingClientRect().top + scrollY, width: canvas.getBoundingClientRect().width, posterDecoded: poster.complete && poster.naturalWidth > 0, canvasOpacity: getComputedStyle(canvas).opacity, posterVisibility: getComputedStyle(poster).visibility });
      }
      last = time;
      if (!window.brainAuditDone) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }, { traceTiles });
  await page.goto(url);
  await page.waitForSelector('.hero-binary-art[data-ready="true"]', { timeout: 20000 });
  await page.waitForTimeout(2400);
  await page.locator(".hero-binary-art").evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
  await page.waitForTimeout(3200);
  const audit = await page.evaluate(() => { window.brainAuditDone = true; return window.brainAudit; });
  const times = audit.frames.filter(frame => frame.ready && frame.phase !== "complete").map(frame => frame.dt).sort((a, b) => a - b);
  const firstReady = audit.frames.find(frame => frame.ready);
  const visiblePops = audit.jumps.filter(jump => jump.phase === "raining" && jump.from < 588 && jump.from + 124 > 12);
  const summary = { slowdown, frames: audit.frames.length, artworkWaitMs: audit.paints[0].t - audit.setupStart, firstReadyMs: firstReady?.t, posterDecodedAtHandoff: firstReady?.posterDecoded, medianFrameMs: times[Math.floor(times.length * .5)], p95FrameMs: times[Math.floor(times.length * .95)], maxFrameMs: times.at(-1), framesOver34ms: times.filter(t => t > 34).length, longTaskCount: audit.longTasks.length, longestTaskMs: Math.max(...audit.longTasks.map(task => task.duration)), heroPositionRange: Math.max(...audit.frames.map(frame => frame.artY)) - Math.min(...audit.frames.map(frame => frame.artY)), visibleRainResets: traceTiles ? visiblePops.length : null };
  await writeFile(`${output}/timings.json`, JSON.stringify({ summary, ...audit }, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  // A separate reload captures presented frames without contaminating timing data.
  const frames = [];
  client.on("Page.screencastFrame", event => {
    frames.push({ data: event.data, timestamp: event.metadata.timestamp });
    void client.send("Page.screencastFrameAck", { sessionId: event.sessionId });
  });
  await page.goto("about:blank");
  await client.send("Page.startScreencast", { format: "jpeg", quality: 75, maxWidth: 1000, maxHeight: 1000, everyNthFrame: 1 });
  await page.goto(url);
  await page.waitForSelector('.hero-binary-art[data-ready="true"]', { timeout: 20000 });
  await page.waitForTimeout(1400);
  await client.send("Page.stopScreencast");
  await Promise.all(frames.map((frame, index) => writeFile(`${output}/frame-${String(index).padStart(3, "0")}.jpg`, Buffer.from(frame.data, "base64"))));
  await writeFile(`${output}/frames.json`, JSON.stringify(frames.map((frame, index) => ({ file: `frame-${String(index).padStart(3, "0")}.jpg`, ms: Math.round((frame.timestamp - frames[0].timestamp) * 1000) }))));
  await writeFile(`${output}/filmstrip.html`, `<!doctype html><meta charset="utf-8"><title>First-load frames</title><style>body{background:#151515;color:#ddd;font:14px monospace}main{display:flex;flex-wrap:wrap;gap:12px}figure{margin:0;width:240px}img{width:100%}</style><h1>First-load compositor frames</h1><main>${frames.map((frame, index) => `<figure><figcaption>${index}: ${Math.round((frame.timestamp - frames[0].timestamp) * 1000)} ms</figcaption><img src="frame-${String(index).padStart(3, "0")}.jpg"></figure>`).join("")}</main>`);
  console.log(`Captured ${frames.length} presented frames in ${output}`);
} finally {
  await browser.close();
}
