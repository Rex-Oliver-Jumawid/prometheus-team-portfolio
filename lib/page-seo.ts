import type { Metadata } from "next";
import { homepageUrl } from "./seo";

export const publicPaths = ["/", "/services/business-websites", "/services/business-systems", "/services/portfolio-websites", "/work/piercing-corner", "/about"] as const;

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = homepageUrl ? new URL(path, homepageUrl).href : undefined;
  const images = [{ url: homepageUrl ? new URL("/opengraph-image", homepageUrl).href : "/opengraph-image", width: 1200, height: 630, alt: "Prometheus — Websites and business systems" }];
  return {
    title, description,
    ...(url ? { alternates: { canonical: url } } : {}),
    robots: { index: Boolean(url), follow: true },
    icons: { icon: "/favicons/prometheus-cream.png", apple: "/favicons/prometheus-cream.png" },
    openGraph: { type: "website", siteName: "Prometheus", locale: "en_PH", title, description, images, ...(url ? { url } : {}) },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function pageStructuredData(path: string, name: string, description: string, type = "WebPage") {
  if (!homepageUrl) return null;
  const url = new URL(path, homepageUrl).href;
  return {
    "@context": "https://schema.org", "@type": type,
    "@id": `${url}#page`, url, name, description, inLanguage: "en-PH",
    isPartOf: { "@id": `${homepageUrl.href}#website` },
    publisher: { "@id": `${homepageUrl.href}#organization` },
  };
}
