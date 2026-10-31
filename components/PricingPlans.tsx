"use client";

import { contact } from "../content/contact";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { pricingPlans, personalPlans, customPlans } from "../content/pricing";
import PricingSelector from "./PricingSelector";

const groups = { personal: personalPlans, business: pricingPlans, custom: customPlans };
type Audience = keyof typeof groups;
const options = [{value:"personal",label:"Personal"},{value:"business",label:"Business"},{value:"custom",label:"Custom"}];
function PlanCards({ audience }: { audience: Audience }) {
 const plans = groups[audience];
 return (
        <div className="pricing-plans" data-plan-count={plans.length}>
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
                <div className="pricing-build-first">We build it first for free, no payment.</div>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={feature}>
                      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><defs><mask id={`pricing-check-${audience}-${plan.id}-${featureIndex}`}><rect width="20" height="20" fill="white" /><path d="m5.5 10 3 3 6-6" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></mask></defs><circle cx="10" cy="10" r="9" fill="currentColor" mask={`url(#pricing-check-${audience}-${plan.id}-${featureIndex})`} /></svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
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
  <PricingSelector options={options} value={audience} onChange={value => {setPrevious(audience);setAudience(value as Audience);}} />
  <div ref={shell} className="pricing-panels">
   {previous && <div key={`out-${previous}`} className="pricing-panel-out" aria-hidden="true" inert><PlanCards audience={previous} /></div>}
   <div ref={panel} key={audience} className={previous ? "pricing-panel-in" : undefined} role="region" aria-label={`${options.find(option => option.value === audience)?.label} pricing`}><PlanCards audience={audience} /></div>
  </div>
 </>;
}
