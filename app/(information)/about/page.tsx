import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "../../../content/team";
import { contact } from "../../../content/contact";
import { pageMetadata, pageStructuredData } from "../../../lib/page-seo";
import PageStructuredData from "../../../components/PageStructuredData";
const title = "About Prometheus | Website & Software Team Philippines";
const description = "Meet the Prometheus team building websites and business systems for Philippine small businesses, freelancers, and professionals. Explore our work and get in touch.";
export const metadata = pageMetadata("/about", title, description);
export default function AboutPage() {
  return <main id="information-main" className="information-main">
    <PageStructuredData data={pageStructuredData("/about", title, description, "AboutPage")} />
    <nav className="information-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>About</span></nav>
    <div className="information-hero"><p className="information-eyebrow">Meet Prometheus</p><h1>Your very own IT team.</h1><p className="information-lead">We build websites and digital systems for Philippine small businesses, freelancers, and professionals. Our work brings together a public presence for your customers and practical tools for the people running your business.</p><Link className="information-button" href="/contact">Tell us about your project ↗</Link></div>
    <section className="information-section"><h2>What we do</h2><div className="information-grid"><article className="information-card"><h3>Websites people can explore</h3><p>Business websites, product catalogs, personal portfolios, and professional websites that explain what you do and help visitors contact you.</p><Link href="/services/business-websites">Business websites ↗</Link><br /><Link href="/services/portfolio-websites">Personal and professional websites ↗</Link></article><article className="information-card"><h3>Software shaped around your work</h3><p>Custom business systems and individual modules for client records, inventory, appointments, and reporting, based on an agreed project scope.</p><Link href="/services/business-systems">Business systems ↗</Link></article></div></section>
    <section className="information-section"><h2>The people behind the work</h2><div className="information-team">{teamMembers.map(member => <article key={member.id}><Image src={member.portrait} alt={member.name} width={400} height={400} sizes="(max-width: 900px) 42vw, 22vw" /><h3>{member.name}</h3><p>{member.role}</p></article>)}</div></section>
    <section className="information-section"><h2>Start with the problem that matters</h2><p>Tell us what your business needs and where your current process gets in the way. We discuss what is useful, what fits the budget, and what can be added later. If you only need one part of a system, our modular development service lets you start with that part.</p><Link href="/work/piercing-corner">See the Piercing Corner project ↗</Link></section>
    <section className="information-section"><h2>Contact Prometheus</h2><p>Email us at <a href="mailto:prometheus.exps@gmail.com">prometheus.exps@gmail.com</a>, send a <Link href="/contact">project inquiry</Link>, or book time to discuss your idea.</p><a className="information-button" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{contact.meetingLabel} ↗</a></section>
  </main>;
}
