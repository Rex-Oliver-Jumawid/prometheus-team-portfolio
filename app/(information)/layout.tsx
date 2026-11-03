import type { ReactNode } from "react";
import Link from "next/link";
import "./information.css";

export default function InformationLayout({ children }: { children: ReactNode }) {
  return <div className="information-site">
    <a className="information-skip" href="#information-main">Skip to content</a>
    <header className="information-header">
      <Link className="information-brand" href="/" aria-label="Prometheus home">prometheus<span aria-hidden="true">↗</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/services/business-websites">Websites</Link>
        <Link href="/services/business-systems">Systems</Link>
        <Link href="/services/portfolio-websites">Portfolios</Link>
        <Link href="/work/piercing-corner">Our work</Link>
        <Link href="/about">About</Link>
        <Link className="information-button is-small" href="/contact">Let’s talk ↗</Link>
      </nav>
    </header>
    {children}
    <footer className="information-footer">
      <div><p className="information-eyebrow">Your next idea. Our next build.</p><h2>Let’s make something useful.</h2><Link className="information-button" href="/contact">Discuss your project ↗</Link></div>
      <nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/services/business-websites">Business websites</Link><Link href="/services/business-systems">Business systems</Link><Link href="/services/portfolio-websites">Portfolio websites</Link><Link href="/work/piercing-corner">Piercing Corner</Link><Link href="/about">About Prometheus</Link><a href="mailto:prometheus.exps@gmail.com">prometheus.exps@gmail.com</a></nav>
    </footer>
  </div>;
}
