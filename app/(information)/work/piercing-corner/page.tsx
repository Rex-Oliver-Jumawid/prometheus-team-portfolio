import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "../../../../content/caseStudies";
import { pageMetadata, pageStructuredData } from "../../../../lib/page-seo";
import PageStructuredData from "../../../../components/PageStructuredData";

const title = "Piercing Corner Website & Studio System | Prometheus";
const description = "Explore the Piercing Corner project: a public website, appointment booking, digital waivers, client records, and a custom studio management system.";
export const metadata = pageMetadata("/work/piercing-corner", title, description);
export default function PiercingCornerPage() {
  const project = caseStudies.find(item => item.id === "piercing-corner")!;
  const images = [
    { src: project.showcaseImage!, caption: "Public website showcasing Piercing Corner’s services and jewelry." },
    { src: project.operationsImage!, caption: "Studio management interface presented on a tablet." },
    { src: project.workspaceImage!, caption: "The Piercing Corner digital studio experience." },
  ];
  return <main id="information-main" className="information-main">
    <PageStructuredData data={pageStructuredData("/work/piercing-corner", title, description)} />
    <nav className="information-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Piercing Corner</span></nav>
    <div className="information-hero"><p className="information-eyebrow">Selected work · Website & business system</p><h1>A digital front door.<br />A connected piercing studio.</h1><p className="information-lead">{project.description}</p><a className="information-button" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit Piercing Corner ↗</a></div>
    <section className="information-section"><h2>The challenge</h2><p>Piercing Corner described two practical problems: storing and organizing growing numbers of paper waivers, and repeatedly sending jewelry pictures and service information in response to inquiries. The project focused on making that information easier to access and day-to-day studio work easier to organize.</p></section>
    <section className="information-section"><h2>What we built</h2><div className="information-grid"><article className="information-card"><h3>A public website</h3><p>A place for customers to explore jewelry and piercing services, choose a preferred piercer, and book an appointment.</p></article><article className="information-card"><h3>A studio management system</h3><p>A workspace for owner and staff workflows, including client records, appointments, digital waivers with e-signatures, sales tracking, and reports.</p></article></div><div className="information-gallery">{images.map((image, index) => <figure key={image.src}><Image src={image.src} alt={image.caption} width={1200} height={900} sizes="(max-width: 600px) 90vw, 45vw" priority={index === 0} /><figcaption>{image.caption}</figcaption></figure>)}</div></section>
    <section className="information-section"><h2>What changed in the workflow</h2><ul><li>Customers can browse service and jewelry information through the website.</li><li>Appointment booking connects customers with available schedules and piercers.</li><li>Digital waivers provide an alternative to collecting and storing physical forms.</li><li>Client records, appointments, and sales information are available within the management system.</li><li>The owner can access the business system remotely.</li></ul><p className="information-note">This case study describes the delivered functionality. No quantified time savings, revenue increases, or conversion results are claimed.</p></section>
    <section className="information-section"><h2>Have a similar workflow to improve?</h2><p>Start with the problem your team faces most often. We can discuss a website, a management system, or a focused module around that need.</p><div className="information-related"><Link href="/services/business-websites">Explore business websites ↗</Link><Link href="/services/business-systems">Explore business systems ↗</Link><Link href="/contact">Discuss your project ↗</Link></div></section>
  </main>;
}
