export default function PageStructuredData({ data }: { data: object | null }) {
  return data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} /> : null;
}
