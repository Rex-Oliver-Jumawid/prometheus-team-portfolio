import type { MetadataRoute } from "next";
import { homepageUrl } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // The reference study at / is deliberately excluded.
  return homepageUrl ? [{ url: homepageUrl.href }] : [];
}
