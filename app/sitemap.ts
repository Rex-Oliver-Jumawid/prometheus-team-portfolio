import type { MetadataRoute } from "next";
import { homepageUrl } from "../lib/seo";
import { publicPaths } from "../lib/page-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return homepageUrl ? publicPaths.map(path => ({ url: new URL(path, homepageUrl).href })) : [];
}
