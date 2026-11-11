import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import { teamMembers } from "../content/team";
import TeamReveal from "./TeamReveal";

export default function TeamSection() {
  return (
    <TeamReveal>
      <div className={`team-content ${GeistSans.variable}`}>
        <header className="team-intro">
          <h2 id="team-title" tabIndex={-1}>Meet the team<br />behind Prometheus</h2>
          <div className="team-intro-copy">
            <p>We are builders in the tech space. Problem solvers and curious minds. Three people, bringing different perspectives to everything we build.</p>
            <span>Small team. Shared Ambition. Shared Mission.<br />To help small to medium businesses leverage technology.</span>
          </div>
        </header>
        <ul className="team-grid" aria-label="Prometheus team">
          {teamMembers.map(member => (
            <li className="team-member" key={member.id}>
              <div className="team-portrait">
                <Image src={member.portrait} alt={member.portrait.includes("placeholder-") ? "" : member.name} width={640} height={640} />
                {member.portrait.includes("placeholder-") && <span>Sample portrait</span>}
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </TeamReveal>
  );
}
