import { pricingPlans, personalPlans } from "./pricing";
import { frequentlyAskedQuestions } from "./faq";

export const servicePages = {
  "business-websites": {
    path: "/services/business-websites", label: "Business websites",
    title: "Business Website Development Philippines | Prometheus",
    description: "Business websites for Philippine small businesses. Explore Prometheus website features, one-time pricing, hosting terms, and a real project example.",
    heading: "A website that introduces your business before you do.",
    summary: "Prometheus builds responsive business websites for Philippine small businesses that need to showcase their services, explain their offer, and help customers get in touch.",
    audience: "For business owners who need a public home for their services, products, and contact details, or want to improve an existing website.",
    capabilities: [
      ["Make your offer clear", "Present your business, services, and products with a layout built around what your customers need to know."],
      ["Help customers take the next step", "Connect visitors to your contact channels, social profiles, and inquiry flow."],
      ["Work across devices", "Give visitors a responsive experience on phones, tablets, and computers."],
      ["Build a search foundation", "Include basic Google SEO setup and readable content that describes your business."],
    ],
    plans: [pricingPlans[0]], faqIds: ["free-start", "initial-build", "payment", "hosting-domain"],
  },
  "business-systems": {
    path: "/services/business-systems", label: "Business systems",
    title: "Custom Business Systems Philippines | Prometheus",
    description: "Custom business systems for Philippine businesses: CRM, inventory, appointments, sales reports, and focused software modules. See scope and pricing terms.",
    heading: "Bring your everyday work into one useful system.",
    summary: "Prometheus builds custom business management systems for Philippine businesses. Depending on your scope, these can connect client records, inventory, appointments, payments, and reports in a shared workspace.",
    audience: "For owners and staff who manage information across spreadsheets, messages, and separate tools, and need software shaped around their actual workflow.",
    capabilities: [
      ["CRM and customer records", "Organize client information and service history so your team can find the details it needs."],
      ["Inventory and orders", "Track products, stock, quotations, and orders with tools matched to your business process."],
      ["Appointments and scheduling", "Coordinate customer bookings, staff availability, and appointments."],
      ["Sales and reporting", "Bring payment records and operational reports together so owners can review business activity."],
    ],
    plans: [pricingPlans[1], pricingPlans[2]], faqIds: ["modular-development", "budget", "payment"],
  },
  "portfolio-websites": {
    path: "/services/portfolio-websites", label: "Portfolio websites",
    title: "Portfolio & Professional Websites Philippines | Prometheus",
    description: "Personal portfolios and professional websites for Philippine freelancers, VAs, brokers, and consultants. Compare features, pricing, and project terms.",
    heading: "Your work deserves a place of its own.",
    summary: "Prometheus creates personal portfolios and professional websites for freelancers, virtual assistants, brokers, consultants, and independent professionals in the Philippines.",
    audience: "For people who want a place to introduce themselves, showcase their work, explain their services, and make it easier for potential clients to contact them.",
    capabilities: [
      ["Introduce yourself", "Share your background and the work you do in a website designed around your identity."],
      ["Show your work", "Organize your projects and services in a portfolio that visitors can explore."],
      ["Connect with clients", "Include contact and social links; the professional package also includes booking links."],
      ["Support your workflow", "The professional website package includes CRM and management tools tailored to your work. Scope is agreed before development."],
    ],
    plans: personalPlans, faqIds: ["budget", "payment", "hosting-domain"],
  },
} as const;
export type ServicePageKey = keyof typeof servicePages;
export function serviceFAQs(key: ServicePageKey) {
  return frequentlyAskedQuestions.filter(item => (servicePages[key].faqIds as readonly string[]).includes(item.id));
}
