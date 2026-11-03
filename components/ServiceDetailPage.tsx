import Link from "next/link";
import { servicePages, serviceFAQs, type ServicePageKey } from "../content/servicePages";
import { homepageUrl } from "../lib/seo";
import { pageStructuredData } from "../lib/page-seo";
import PageStructuredData from "./PageStructuredData";

export default function ServiceDetailPage({ service }: { service: ServicePageKey }) {
  const page = servicePages[service];
  const data = pageStructuredData(page.path, page.title, page.description);
  const serviceData = homepageUrl ? {
    "@context": "https://schema.org", "@type": "Service", name: page.label,
    description: page.summary, url: new URL(page.path, homepageUrl).href,
    provider: { "@id": `${homepageUrl.href}#organization`, "@type": "Organization", name: "Prometheus" },
    areaServed: { "@type": "Country", name: "Philippines" },
  } : null;
  return <main id="information-main" className="information-main">
    <PageStructuredData data={data} /><PageStructuredData data={serviceData} />
    <nav className="information-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{page.label}</span></nav>
    <div className="information-hero"><p className="information-eyebrow">{page.label} · Philippines</p><h1>{page.heading}</h1><p className="information-lead">{page.summary}</p><Link className="information-button" href="/contact">Tell us what you have in mind ↗</Link></div>
    <section className="information-section"><h2>Who this is for</h2><p>{page.audience}</p></section>
    <section className="information-section"><h2>What we can build together</h2><div className="information-grid">{page.capabilities.map(([title, text]) => <article className="information-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="information-section"><h2>Packages and pricing</h2><p>These are our currently listed packages. We discuss the requirements and confirm the scope before you agree to a project.</p><div className="information-grid">{page.plans.map(plan => <article className="information-card" key={plan.id}><h3>{plan.name}</h3><p className="information-price">{plan.price}</p><p className="information-unit">{plan.unit}</p><ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Link href="/contact">Discuss this package ↗</Link></article>)}</div><p className="information-note">Listed project prices are development fees. Optional paid services, third-party subscriptions, custom domains, and future upgrades are discussed separately before you agree to them. For requirements outside these packages, ask for a custom scope.</p></section>
    <section className="information-section"><h2>How a project starts</h2><ol><li>Tell us about your business, audience, and the problem you want to solve.</li><li>Discuss the features, scope, and budget with our team.</li><li>Agree on the project details, delivery schedule, and next steps before moving forward.</li></ol></section>
    {service !== "portfolio-websites" && <section className="information-section"><p className="information-eyebrow">A project in practice</p><h2>Piercing Corner</h2><p>Explore how a public website and studio management system bring services, appointments, clients, and digital waivers together.</p><Link href="/work/piercing-corner">Read the Piercing Corner case study ↗</Link></section>}
    <section className="information-section"><h2>Questions before you start</h2>{serviceFAQs(service).map(item => <article className="information-faq" key={item.id}><h3>{item.question}</h3><p>{item.answer}</p></article>)}<article className="information-faq"><h3>How long will my project take?</h3><p>The schedule depends on the agreed scope, content, and integrations. Contact us with your requirements so we can discuss a delivery plan for your project.</p></article></section>
    <section className="information-section"><h2>Explore more</h2><div className="information-related">{Object.entries(servicePages).filter(([key]) => key !== service).map(([key, item]) => <Link href={item.path} key={key}>{item.label} ↗</Link>)}<Link href="/about">Meet Prometheus ↗</Link></div></section>
  </main>;
}
