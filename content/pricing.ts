export const personalPlans = [
 { id: "one-page", name: "One-Page Portfolio", price: "₱2,499", unit: "Starting at · One-time project fee", description: "Introduce yourself, showcase your work, and help potential clients reach you—all on one professionally designed page.", action: "Start a project", featured: false, features: ["One page with up to 5 sections", "Design adapted to your style and branding", "Mobile-friendly layout", "About, services, selected work, and contact sections", "Social media and booking links", "Basic search engine setup", "One consolidated revision round", "Testing and deployment"] },
 { id: "multi-page", name: "Multi-Page Portfolio", price: "₱4,999", unit: "Starting at · One-time project fee", description: "Give your work more room. Present your services, projects, and experience across dedicated pages so potential clients can explore what you offer.", action: "Start a project", featured: true, features: ["Up to 5 pages with a consistent design", "Dedicated profile, services, work, and contact pages", "Project showcases using content you provide", "Mobile-friendly layout", "Social media and booking links", "Basic search engine setup for each page", "Two consolidated revision rounds", "Testing and deployment"] },
];

export const studentPlans = [
 { id: "consultation", name: "Project Consultation", price: "Let’s discuss", unit: "Quoted based on scope", description: "Get a review of your existing system, code, or documentation. We identify issues and recommend improvements; implementation is quoted separately.", action: "Discuss your project", featured: false, features: ["Review of the work you have already made", "Guidance on issues and improvements", "Consultation scope agreed before work begins"] },
 { id: "development", name: "Software Development", price: "₱8,999", unit: "Starting at · One-time project fee", description: "We build the system your team has planned, based on your title, requirements, features, and school guidelines.", action: "Plan your project", featured: false, features: ["Development of your agreed system scope", "Testing and deployment", "Source code and setup instructions", "Code and system walkthrough", "Two consolidated in-scope revision rounds", "30-day bug-fix warranty after handover"] },
 { id: "complete", name: "Development + Documentation + Consultation", price: "₱10,999", unit: "Starting at · One-time project fee", description: "Shape your project direction with us, then develop the agreed system with technical documentation that helps your team understand and explain it.", action: "Plan your project", featured: true, features: ["Everything in Software Development", "Two consultations: project direction and final requirements", "Guidance on title, problem statement, objectives, scope, and features", "Agreed technical sections and system diagrams", "User guide and software testing records", "One consolidated documentation revision round"] },
];

export const businessPlans = [
 { id: "business-system", name: "Custom Business System", price: "₱14,999", unit: "Starting at · Development fee", description: "A system built around how your business works. Start with a consultation and a free prototype before deciding whether to invest in full development.", action: "Discuss your business", featured: true, features: ["Consultation on your workflow, problems, and priorities", "Prototype in 1–2 weeks after requirements are agreed", "One agreed business process demonstrated from start to finish", "One prototype feedback round and one revised version", "Custom development based on the accepted scope and quote", "Two consolidated in-scope revision rounds during client testing", "Testing, launch, and handover", "Three-month corrective maintenance warranty from launch"] },
];

export const pricingTerms = {
 personal: {
  title: "Personal website terms",
  sections: [
   { title: "Preview and payment", text: "Review one free preview and one revised version, then decide whether to continue. Pay 50% after preview approval and the remaining 50% before launch." },
   { title: "Hosting and domains", text: "First-year hosting and a yourname.promths.com subdomain are included. Continued subdomain use costs ₱500/year after the first year. Custom domains cost extra and renew annually, or you can provide your own domain. We handle setup." },
   { title: "Content and support", text: "You provide final text and images. A 30-day warranty after launch covers bugs in agreed features. Maintenance, content edits, new features, and paid third-party services are separate. CRM and custom management systems require a separate quote." },
  ],
 },
 student: {
  title: "Custom Software Development for Student Projects",
  sections: [
   { title: "Scope and payment", text: "Pay 50% after scope agreement and 50% before final handover. Development begins after any required school approval. Development packages include two consolidated in-scope revision rounds and a 30-day bug-fix warranty after handover. New titles or major feature changes require a revised quote." },
   { title: "Documentation and consultation", text: "The ₱10,999 package includes two consultation sessions: refining the project direction and finalizing requirements. We agree on technical sections and diagrams before work begins, with one documentation revision round. Documentation covers the implemented software, not a full research manuscript." },
   { title: "What students provide", text: "Your team provides school requirements, rubrics, templates, evaluation forms, Google Forms, surveys, respondents, system reviews, and collected adviser or user feedback. Creating or conducting surveys and academic evaluations is not included. Research findings, academic conclusions, and understanding the submitted work remain your responsibility." },
   { title: "Additional costs", text: "Additional features, hardware, hosting, domains, paid third-party services, and ongoing maintenance are quoted separately." },
  ],
 },
 business: {
  title: "From prototype to production",
  sections: [
   { title: "Free prototype", text: "One agreed workflow, ready in 1–2 weeks after requirements are agreed, with one feedback round and revision. Walk away without paying. This is a preview, not a production system." },
   { title: "Payment", text: "Agree on scope, price, and maintenance first. Pay 50% before development, 30% when ready for client testing, and 20% before launch and handover." },
   { title: "Revisions and costs", text: "Two in-scope revision rounds; bug fixes do not count. New requirements, hosting, domains, databases, and paid integrations cost extra." },
   { title: "Corrective maintenance", text: "Fixes for bugs in delivered features. Included for three months from launch; quoted separately afterward." },
   { title: "Perfective maintenance", text: "Improvements to features, usability, and performance." },
   { title: "Adaptive maintenance", text: "Updates for changing platforms, integrations, or business requirements." },
   { title: "Preventive maintenance", text: "Security updates and health checks to reduce future problems." },
   { title: "Maintenance terms", text: "Costs vary by type and scope, agreed before work begins. Recurring plans define included work and response times. New features, scope changes, third-party changes, and outside modifications are not covered by the warranty." },
  ],
 },
};
