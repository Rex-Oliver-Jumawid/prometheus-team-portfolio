import test from "node:test";
import assert from "node:assert/strict";
import { publicHomepage, homepageMetadata, homepageStructuredData } from "../lib/seo.ts";
import { publicPaths, pageMetadata } from "../lib/page-seo.ts";
import sitemapModule from "../app/sitemap.ts";
const sitemap = typeof sitemapModule === "function" ? sitemapModule : sitemapModule.default;

test("SEO accepts an explicit public page URL without guessing a domain", () => {
  assert.equal(publicHomepage("") , undefined);
  assert.equal(publicHomepage("https://example.com/prometheus").href, "https://example.com/prometheus");
  for (const url of ["http://example.com", "https://localhost/prometheus", "https://example.com/?preview=1", "https://user:pass@example.com/"]) {
    assert.throws(() => publicHomepage(url));
  }
});

test("indexing and sitemap use only the configured homepage", () => {
  const url = publicHomepage();
  assert.equal(homepageMetadata.robots.index, Boolean(url));
  assert.deepEqual(sitemap(), url ? publicPaths.map(path => ({ url: new URL(path, url).href })) : []);
  assert.equal(homepageMetadata.alternates?.canonical, url?.href);
  const graph = JSON.parse(JSON.stringify(homepageStructuredData))["@graph"];
  assert.equal(graph[0].email, "prometheus.exps@gmail.com");
  assert.equal(graph[0].hasOfferCatalog.itemListElement.length, 4);
  assert.equal(graph.some(item => item.aggregateRating), false);
});

test("homepage sharing declares the branded root image with social dimensions", () => {
  const image = homepageMetadata.openGraph.images[0];
  assert.equal(image.url, publicHomepage() ? new URL('/opengraph-image', publicHomepage()).href : '/opengraph-image');
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
  assert.equal(homepageMetadata.twitter.images[0].url, image.url);
});

 test("public pages override the private root metadata and use their own canonical", () => {
  const configured = publicHomepage();
  const canonicals = new Set();
  for (const path of publicPaths.slice(1)) {
    const metadata = pageMetadata(path, `Page ${path}`, `Description ${path}`);
    assert.equal(metadata.robots.index, Boolean(configured));
    assert.equal(metadata.robots.follow, true);
    assert.equal(metadata.alternates?.canonical, configured ? new URL(path, configured).href : undefined);
    assert.equal(metadata.openGraph.url, metadata.alternates?.canonical);
    if (configured) canonicals.add(metadata.alternates.canonical);
  }
  assert.equal(canonicals.size, configured ? 5 : 0);
});
