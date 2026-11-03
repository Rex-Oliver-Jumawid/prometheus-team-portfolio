# Homepage SEO

The Prometheus page is currently served at `/prometheus`. The captured reference at `/` remains noindex and is excluded from the sitemap.

## When the public domain is ready

1. Set `SEO_HOMEPAGE_URL` to the complete HTTPS URL of the actual Prometheus homepage on the production deployment. Include `/prometheus` while that is its public route. Do not set it on preview deployments.
2. Rebuild. This enables indexing and generates the canonical URL, absolute share URLs, and the sitemap entry. Without this setting the page stays noindex, with no guessed canonical or sitemap URL.
3. Check `/robots.txt`, `/sitemap.xml`, and the rendered page metadata on the public deployment. If moving Prometheus to `/`, move the route and redirect the old URL before changing the setting.
4. Verify the domain in Google Search Console and submit `/sitemap.xml`.

The page includes a descriptive title and summary, Open Graph/Twitter metadata, a generated sharing image, and Organization/WebSite/service JSON-LD. Business details are limited to confirmed information; no invented address, review ratings, or social profiles are included. Search appearance and rankings are not guaranteed.

The visible hero identifies the services and Philippine audience. Existing service descriptions, case studies, pricing and FAQ answers remain readable in server-rendered HTML. Personal pricing is available through the pricing selector. Keep claims, prices and case-study outcomes accurate as the content changes.
