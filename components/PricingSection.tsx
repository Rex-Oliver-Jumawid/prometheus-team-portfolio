import { GeistSans } from "geist/font/sans";
import PricingPlans from "./PricingPlans";
import PricingReveal from "./PricingReveal";

export default function PricingSection() {
  return (
    <div className="pricing-reveal-backdrop">
      <PricingReveal className={GeistSans.variable}>
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Premium Experiences</em></h2>
          <p><strong>We help you get where you want to go.</strong></p>
        </header>

        <PricingPlans />

      </div>
    </PricingReveal>
    </div>
  );
}
