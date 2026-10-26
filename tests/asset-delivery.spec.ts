import { expect, test } from "@playwright/test";

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`font files download once at ${viewport.width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const fonts: string[] = [];
    page.on("request", request => {
      if (new URL(request.url()).pathname.endsWith(".woff2")) fonts.push(request.url());
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    // CSS and early preloads must agree on the entire URL, including any
    // deployment query parameter, so the browser can reuse each response.
    const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll(elements =>
      elements.map(element => (element as HTMLLinkElement).href),
    );
    expect(preloads).toHaveLength(2);
    expect(fonts).toHaveLength(2);
    expect(new Set(fonts.map(url => new URL(url).pathname)).size).toBe(2);
    expect(fonts.toSorted()).toEqual(preloads.toSorted());
    await context.close();
  });
}

test("dedicated icons preserve their dimensions and use immutable versioned URLs", async ({ page, request }) => {
  await page.goto("/");
  const icons = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll(elements =>
    elements.map(element => ({ href: element.getAttribute("href")!, sizes: element.getAttribute("sizes")! })),
  );
  expect(icons).toEqual(expect.arrayContaining([
    { href: "/images/icons/v1/favicon-32.png", sizes: "32x32" },
    { href: "/images/icons/v1/favicon-48.png", sizes: "48x48" },
    { href: "/images/icons/v1/apple-touch-icon.png", sizes: "180x180" },
  ]));
  expect(icons.some(icon => icon.href.includes("kclogo.png"))).toBe(false);

  for (const icon of icons) {
    const response = await request.get(icon.href);
    expect(response.ok()).toBe(true);
    expect(response.headers()["cache-control"]).toBe("public, max-age=31536000, immutable");
    const bytes = await response.body();
    const size = Number(icon.sizes.split("x")[0]);
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
    expect(bytes.length).toBeLessThan(size === 180 ? 40_000 : 8_000);
  }

  // The original unversioned logo must remain replaceable between deployments.
  const original = await request.head("/images/kclogo.png");
  expect(original.headers()["cache-control"]).not.toContain("immutable");
});
