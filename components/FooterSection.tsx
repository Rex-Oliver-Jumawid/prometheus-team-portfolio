import { GeistSans } from "geist/font/sans";
import { contact, footerLinks } from "../content/contact";
import FooterReveal from "./FooterReveal";
import FooterWordmark from "./FooterWordmark";

export default function FooterSection() {
  return (
    <FooterReveal>
      <div className="prometheus-footer-artboard">
        <div className="prometheus-footer-foreground">
          <div className="prometheus-footer-top"><span className="prometheus-footer-brand"><span className="prometheus-footer-flame" aria-hidden="true" /></span><a className={`prometheus-footer-email ${GeistSans.variable}`} href="mailto:prometheus.exps@gmail.com"><span>Email</span><span>prometheus.exps@gmail.com</span></a></div>
          <div className="prometheus-footer-main">
            <h2>Let us show you what we can do for your business.</h2>
            <p>We’re your very own IT team, here to support you every step of the way.</p>
          </div>
          <div className="prometheus-footer-lower" id="contact-actions">
            <nav className="prometheus-footer-links" aria-label="Footer navigation">
              {[[{ label: "Services", href: "#services" }, { label: "Work", href: "#works" }, footerLinks[3], footerLinks[2]]].map((links, index) => <div className="prometheus-footer-link-column" key={index}><span className="prometheus-footer-link-label">{index === 0 ? "Main" : "Links"}</span>{links.map(link => <a className="prometheus-footer-main-link" key={link.href} href={link.href} aria-label={link.label}><span className="prometheus-footer-label-window" aria-hidden="true"><span className="prometheus-footer-label-roll"><span>{link.label}</span><span className="prometheus-footer-label-copy">{link.label}</span></span></span></a>)}</div>)}
            </nav>
            <a className="prometheus-footer-cta" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{contact.meetingLabel} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="prometheus-footer-socials" aria-label="Social channels">
            <a href="https://www.facebook.com/profile.php?id=61593771133079" target="_blank" rel="noopener noreferrer" className="prometheus-footer-social social-facebook" aria-label="Facebook"><img src="/favicons/facebook.svg" alt="" width="48" height="48" /></a>
            <a href="https://www.instagram.com/prometheus.exps/" target="_blank" rel="noopener noreferrer" className="prometheus-footer-social social-instagram" aria-label="Instagram"><img src="/favicons/instagram.svg" alt="" width="48" height="48" /></a>
            <a href="viber://chat?number=%2B639613591311" className="prometheus-footer-social social-viber" aria-label="Viber"><img src="/favicons/viber.svg" alt="" width="48" height="48" /></a>
          </div>
        </div>
        <FooterWordmark />
      </div>
    </FooterReveal>
  );
}

