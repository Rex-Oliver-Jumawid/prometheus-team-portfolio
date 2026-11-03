const groups = [
  {
    title: "Websites",
    items: [
      ["Landing Pages", "Focused pages that introduce an offer and help visitors take the next step."],
      ["Business Websites", "Responsive websites that present your business, services, and contact information."],
      ["Product Catalogs", "Searchable product collections with clear information and quotation flows."],
      ["Website Redesign", "Improvements to an existing website's layout, usability, and responsive experience."],
      ["Website Maintenance", "Ongoing updates and fixes that keep your website useful as your business changes."],
    ],
  },
  {
    title: "Business Systems",
    items: [
      ["ERP & Operations", "Connected tools for the daily workflows your team needs to manage."],
      ["Inventory & Orders", "Keep track of products, stock, quotations, and customer orders."],
      ["Payments & Deliveries", "Manage payment records and delivery workflows alongside your orders."],
      ["Scheduling & Bookings", "Organize appointments, availability, staff, and customer bookings."],
      ["Client Relational Management (CRM)", "Bring client information and service history into a shared workspace."],
    ],
  },
  {
    title: "Custom Solutions",
    items: [
      ["Custom Web Apps", "Purpose-built web applications shaped around your users and requirements."],
      ["Integrated Platforms", "Connect your public website with the systems that run your business."],
      ["Mobile Applications", "Mobile experiences designed for the tasks your customers need on the go."],
      ["System Integrations", "Connect existing tools so information can move between your workflows."],
      ["Workflow Automation", "Reduce repetitive manual work with software tailored to your process."],
    ],
  },
] as const;

function ServiceArrow() {
  return <svg width="33" height="32" viewBox="0 0 33 32" fill="none" aria-hidden="true"><path d="M11.3359 21H21.3359M21.3359 11V21M21.3359 21L11.3359 11" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="home-updated-section home-services-section prometheus-services">
      <div className="w-layout-blockcontainer home-container w-container">
        <div className="home-services-top">
          <p className="home-title-upcase">Services</p>
          <h2 id="services-title" className="home-title home-services-title"><em className="is-italic">What We Offer</em></h2>
        </div>
        <div className="home-services-content-wrapper">
          <div className="home-services-content">
            {groups.map(group => (
              <article id={`services-${group.title.toLowerCase().replace(/\s+/g, "-")}`} key={group.title} className="home-services-content-item">
                <h3 className="home-services-content-item-title">{group.title}</h3>
                <div className="home-services-content-items">
                  {group.items.map(([title, description]) => (
                    <details key={title} className="prometheus-service">
                      <summary className="home-services-content-item-link">
                        <span className="home-services-content-item-text">{title}</span>
                        <span className="home-services-content-item-icon"><ServiceArrow /></span>
                      </summary>
                      <p className="prometheus-service-description">{description}</p>
                    </details>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
