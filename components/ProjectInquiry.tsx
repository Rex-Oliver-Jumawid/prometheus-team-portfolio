"use client";

import { contact } from "../content/contact";

const budgets = ["Under ₱5,000", "₱5,000-₱15,000", "₱15,000-₱30,000", "₱30,000+", "Let's discuss"];

export default function ProjectInquiry() {
  return <form className="inquiry-form" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const booking = new URL(contact.meetingUrl);
    booking.searchParams.set("name", String(data.get("name")));
    booking.searchParams.set("email", String(data.get("email")));
    booking.searchParams.set("notes", `Budget: ${data.get("budget")}\n\n${data.get("project")}`);
    window.open(booking.toString(), "_blank", "noopener,noreferrer");
  }}>
    <p className="inquiry-eyebrow">LET’S BUILD SOMETHING USEFUL</p>
    <h1>Tell us about<br />your project.</h1>
    <p className="inquiry-intro">A website, a business system, or a custom idea. Tell us what you need and we’ll explore it together.</p>
    <div className="inquiry-fields">
      <label>Full name<span aria-hidden="true"> *</span><input name="name" autoComplete="name" required maxLength={120} /></label>
      <label>Email address<span aria-hidden="true"> *</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <fieldset><legend>What budget are you working with?</legend><div className="inquiry-budgets">{budgets.map(budget => <label key={budget}><input type="radio" name="budget" value={budget} required /><span>{budget}</span></label>)}</div></fieldset>
    <label>About your project<span aria-hidden="true"> *</span><textarea name="project" rows={2} required maxLength={2000} placeholder="What does your business do, and what would you like to improve?" /></label>
    <button className="inquiry-submit" type="submit">Choose a call time</button>
    <p className="inquiry-note">Next, choose an available time on our booking calendar in a new tab. Your details will be carried over. No payment or contract required to start a conversation.</p>
  </form>;
}
