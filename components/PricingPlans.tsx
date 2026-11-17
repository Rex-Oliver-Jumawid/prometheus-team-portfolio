"use client";

import { contact } from "../content/contact";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { businessPlans, personalPlans, studentPlans, pricingTerms } from "../content/pricing";
import PricingSelector from "./PricingSelector";

const groups = { personal: personalPlans, student: studentPlans, business: businessPlans };
type Audience = keyof typeof groups;
const options = [{value:"personal",label:"Personal"},{value:"student",label:"Student"},{value:"business",label:"Business"}];
function PlanCards({ audience }: { audience: Audience }) {
 const plans = groups[audience];
 return (
        <>
        {audience === "student" && <h3 className="pricing-audience-title">{pricingTerms.student.title}</h3>}
        <div className="pricing-plans" data-plan-count={audience === "business" ? 2 : plans.length}>
          {plans.map(plan => (
            <article key={plan.id} className={`pricing-plan${plan.featured ? " pricing-plan-featured" : ""}`} aria-labelledby={`pricing-${audience}-${plan.id}-title`}>
              <h3 id={`pricing-${audience}-${plan.id}-title`} className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-price">
                <span data-price={plan.price}>{plan.price}</span>
                {plan.unit && <span className="pricing-plan-unit">{plan.unit}</span>}
              </p>
              <p className="pricing-plan-description">{plan.description}</p>
              <a className="pricing-plan-action" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
              <div className="pricing-plan-included">
                <p>What’s Included</p>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={feature}>
                      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><defs><mask id={`pricing-check-${audience}-${plan.id}-${featureIndex}`}><rect width="20" height="20" fill="white" /><path d="m5.5 10 3 3 6-6" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></mask></defs><circle cx="10" cy="10" r="9" fill="currentColor" mask={`url(#pricing-check-${audience}-${plan.id}-${featureIndex})`} /></svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {audience === "business" && <div className="pricing-business-copy">{pricingTerms.business.sections.slice(0, 3).map(section => <p key={section.title}><strong>{section.title}.</strong> {section.text}</p>)}</div>}
              </div>
            </article>
          ))}
          {audience === "business" ? <article className="pricing-plan" aria-labelledby="pricing-maintenance-title">
            <h3 id="pricing-maintenance-title" className="pricing-plan-name">Maintenance &amp; Warranty</h3>
            <p className="pricing-plan-price"><span>Quoted separately</span></p>
            <p className="pricing-plan-description">Three months of corrective maintenance are included from launch. Ongoing maintenance is priced by type and scope, with fees agreed before work begins.</p>
            <a className="pricing-plan-action" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">Discuss maintenance</a>
            <div className="pricing-plan-included pricing-business-copy">{pricingTerms.business.sections.slice(3).map(section => <p key={section.title}><strong>{section.title}.</strong> {section.text}</p>)}</div>
          </article> : <details className="pricing-terms">
            <summary>Payment, warranty &amp; maintenance</summary>
            {pricingTerms[audience].sections.map(section => <p key={section.title}><strong>{section.title}.</strong> {section.text}</p>)}
          </details>}
        </div>
        </>
 );
}

export default function PricingPlans() {
 const [audience, setAudience] = useState<Audience>("business");
 const [previous, setPrevious] = useState<Audience | null>(null);
 const panel = useRef<HTMLDivElement>(null);
 const shell = useRef<HTMLDivElement>(null);
 const height = useRef<number | null>(null);
 const heightAnimation = useRef<Animation | null>(null);
 useEffect(() => {
  if (!previous) return;
  const timer = window.setTimeout(() => setPrevious(null), 360);
  return () => window.clearTimeout(timer);
 }, [audience, previous]);
 useLayoutEffect(() => {
  const next = panel.current?.offsetHeight;
  const old = height.current;
  heightAnimation.current?.cancel();
  if (next !== undefined) {
   if (old !== null && old !== next && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heightAnimation.current = shell.current?.animate([{height:`${old}px`},{height:`${next}px`}],{duration:360,easing:"cubic-bezier(.22,1,.36,1)"}) ?? null;
   }
   height.current = next;
  }
  return () => heightAnimation.current?.cancel();
 }, [audience]);
 return <>
  <PricingSelector options={options} value={audience} onChange={value => {setPrevious(audience);if (value === "personal" || value === "student" || value === "business") setAudience(value);}} />
  <div ref={shell} className="pricing-panels">
   {previous && <div key={`out-${previous}`} className="pricing-panel-out" aria-hidden="true" inert><PlanCards audience={previous} /></div>}
   <div ref={panel} key={audience} className={previous ? "pricing-panel-in" : undefined} role="region" aria-label={`${options.find(option => option.value === audience)?.label} pricing`}><PlanCards audience={audience} /></div>
  </div>
 </>;
}
