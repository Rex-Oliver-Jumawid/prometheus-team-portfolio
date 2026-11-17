import { homepageMetadata, homepageStructuredData } from "../lib/seo";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import SmoothScroll from "../components/SmoothScroll";
import HeroPointer from "../components/HeroPointer";
import Services from "../components/Services";
import CaseStudySection from "../components/CaseStudySection";
import RotatingFavicon from "../components/RotatingFavicon";
import ShowcaseSection from "../components/ShowcaseSection";
import PricingSection from "../components/PricingSection";
import TeamSection from "../components/TeamSection";
import FAQSection from "../components/FAQSection";
import FooterSection from "../components/FooterSection";
import "@fontsource/manrope/latin-400.css";
import "lenis/dist/lenis.css";
import "./prometheus/preview.css";
import "./prometheus/cases.css";
import "./prometheus/showcase.css";
import "./prometheus/pricing.css";
import "./prometheus/team.css";
import "./prometheus/closing.css";
import "./prometheus/mobile.css";

export const metadata = homepageMetadata;

export default function PrometheusPreview() {
  return (
    <div className="page-wrapper prometheus-preview">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData).replace(/</g, "\\u003c") }} />
      <SmoothScroll />
      <HeroPointer />
      <RotatingFavicon />
      <Navigation brand="prometheus" />
      <main className="page-main">
        <div className="prometheus-background-stage">
          <div id="overview" className="prometheus-intro-stage">
            <Hero brand="prometheus" />
            <Services />
          </div>
          <CaseStudySection />
        </div>
        <ShowcaseSection />
        <PricingSection />
        <TeamSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
}
