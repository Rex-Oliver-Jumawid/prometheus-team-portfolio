# Public SEO pages

The Prometheus homepage is served at `/`. `/prometheus` permanently redirects to `/`.

Set `SEO_HOMEPAGE_URL=https://www.promths.com/` on the production deployment and rebuild. Leave it unset on previews. Without it, public pages stay noindex, with no guessed canonical or sitemap entries.

Public routes:
- `/`
- `/services/business-websites`
- `/services/business-systems`
- `/services/portfolio-websites`
- `/work/piercing-corner`
- `/about`

Each information page has its own title, description, canonical, robots override, and social metadata. Main content, pricing and FAQ answers are server-rendered. Service pages use the same package data as the homepage. The case study reuses the existing project content and images, excludes the sample testimonial, and does not claim quantified results.

Public paths are listed in `lib/page-seo.ts` and included in `/sitemap.xml`. The contact inquiry remains noindex and is excluded. The homepage links to service pages, the case study, and About. Check rendered metadata, `/robots.txt`, and `/sitemap.xml` after deployment. Verify the domain in Google Search Console and submit the sitemap. Search rankings and AI citations are not guaranteed.
