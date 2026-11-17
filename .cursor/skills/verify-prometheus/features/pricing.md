# Pricing

Personal, Student and Business radios select an accessible pricing region. Business is the default. Promotional banners are omitted; preview and payment terms remain in the single collapsed disclosure inside each pricing panel. Personal has two portfolios (from ₱2,499 / ₱4,999), Student has consultation plus development (from ₱8,999) and development/documentation/consultation (from ₱10,999), and Business has a custom-system offer (from ₱14,999) in the white featured panel on the left and a maintenance panel on the right, stacked on phones.

Run `pricing`, `pricing --mobile`, and `pricing --reduced-motion` with the verification helper after a fresh build. It checks all card counts and prices, Personal hosting renewal and promths.com, Student evaluation responsibilities, Business process/payment/maintenance disclosures, keyboard ArrowRight/Home/End selection, all consultation link destinations, and horizontal overflow. Inspect screenshots for legibility, wrapping, and disclosure layout.

Enter through `/#pricing` or either navigation Pricing link. Expand “Payment, warranty & maintenance” inside the pricing panel. There is no standalone terms section or separate terms heading. Business has a free prototype with one iteration, staged 50/30/20 payments, and three-month corrective warranty. Personal has a preview with one iteration, 50/50 payments, first-year hosting/subdomain, ₱500 annual subdomain renewal, and 30-day warranty. Student has 50/50 payments, bounded revisions, and student-provided surveys/evaluations; development packages have a 30-day warranty. Compare exact inclusions against content/pricing.ts.

Outgoing animation panels are inert and aria-hidden; scope assertions to the active region. Calendar verification checks href only and does not submit bookings. Extended checks: rapid switching while resizing, direct fragment and both navigation entry points.

Business uses two panels without a terms disclosure; prototype and payment terms are in the development panel and the four maintenance types are in the maintenance panel. Native terms expand and collapse with an intrinsic-height CSS transition where supported; other browsers retain native disclosure behavior. Reduced motion disables transitions. Verify open/close and rapid reversal with keyboard and inspect the settled layout.

Personal and Student disclosure paragraphs use the full available panel width, matching Business terms within their cards. The helper checks paragraph widths in both disclosures at desktop and mobile sizes.
