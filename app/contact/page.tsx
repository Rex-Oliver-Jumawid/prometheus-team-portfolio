import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RotatingFavicon from "../../components/RotatingFavicon";
import ProjectInquiry from "../../components/ProjectInquiry";
import "@fontsource/manrope/latin-400.css";
import "./contact.css";

export const metadata: Metadata = { title: "Let’s talk about your project | Prometheus", icons: { icon: { url: "/favicons/prometheus-cream.png", type: "image/png" }, apple: "/favicons/prometheus-cream.png" }, robots: { index: false, follow: false } };

export default function ContactPage() {
  return <main className="inquiry-page">
    <RotatingFavicon />
    <header className="inquiry-header"><Link href="/" aria-label="Prometheus home">prometheus</Link><Link href="/">Back to home</Link></header>
    <div className="inquiry-layout">
      <aside className="inquiry-profile">
        <div className="inquiry-person"><Image src="/team/olivero.png" alt="Oliver Jumawid" width={110} height={110} priority /><div><h2>Oliver Jumawid</h2><p>Co-Founder &amp; DevOps</p></div></div>
        <p className="inquiry-promise">Your next idea.<br /><em>Our next build.</em></p>
        <ul><li>Let’s understand your business and the problem you want to solve.</li><li>See a free prototype before deciding to move forward.</li><li>Start with what matters most and grow from there.</li></ul>
      </aside>
      <ProjectInquiry />
    </div>
  </main>;
}
