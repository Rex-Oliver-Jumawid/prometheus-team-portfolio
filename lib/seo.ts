import type { Metadata } from "next";

// Set the full public page URL when the domain and routing are final.
export function publicHomepage(value = process.env.SEO_HOMEPAGE_URL): URL | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    throw new Error("SEO_HOMEPAGE_URL must be a public HTTPS page URL without credentials, a query, or a fragment.");
  }
  return url;
}

export const homepageUrl = publicHomepage();
export const seoTitle = "Prometheus | Websites & Business Systems Philippines";
export const seoDescription = "Custom websites, CRM and business management systems for Philippine small businesses, freelancers and professionals. Explore one-time pricing and our work.";
const shareImage = homepageUrl
  ? new URL("/opengraph-image", homepageUrl).href
  : "/opengraph-image";

export const homepageMetadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  applicationName: "Prometheus",
  ...(homepageUrl ? {
    metadataBase: new URL(homepageUrl.origin),
    alternates: { canonical: homepageUrl.href },
  } : {}),
  robots: { index: Boolean(homepageUrl), follow: true },
  openGraph: {
    type: "website", siteName: "Prometheus", locale: "en_PH",
    title: seoTitle, description: seoDescription,
    images: [{ url: shareImage, width: 1200, height: 630, alt: "Prometheus — Websites and business systems for the Philippines" }],
    ...(homepageUrl ? { url: homepageUrl.href } : {}),
  },
  twitter: {
    card: "summary_large_image", title: seoTitle, description: seoDescription,
    ...(shareImage ? { images: [{ url: shareImage, alt: "Prometheus — Websites and business systems for the Philippines" }] } : {}),
  },
};

export const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": homepageUrl ? `${homepageUrl.href}#organization` : "#organization",
      name: "Prometheus", email: "prometheus.exps@gmail.com",
      description: seoDescription,
      ...(homepageUrl ? { url: homepageUrl.href } : {}),
      areaServed: { "@type": "Country", name: "Philippines" },
      hasOfferCatalog: {
        "@type": "OfferCatalog", name: "Website and software development services",
        itemListElement: [
          ["Business Website Development", "Public websites and product catalogs for small and medium businesses."],
          ["Personal and Professional Websites", "Personal websites and professional portfolios for freelancers, virtual assistants and brokers."],
          ["Business Management Systems", "Custom CRM, inventory, orders, appointments and reporting systems."],
          ["Modular Software Development", "Focused software modules that solve individual business problems."],
        ].map(([name, description]) => ({
          "@type": "Offer", itemOffered: {
            "@type": "Service", name, description,
            provider: { "@id": homepageUrl ? `${homepageUrl.href}#organization` : "#organization" },
            areaServed: { "@type": "Country", name: "Philippines" },
          },
        })),
      },
    },
    ...(homepageUrl ? [{
      "@type": "WebSite", "@id": `${homepageUrl.href}#website`,
      name: "Prometheus", url: homepageUrl.href, inLanguage: "en-PH",
      publisher: { "@id": `${homepageUrl.href}#organization` },
    }] : []),
  ],
};
