import copy from '../../data/team/page.json';

export default function TeamHero(){
  return <header className="team-hero">
    <p className="team-eyebrow">{copy.eyebrow}</p>
    <h1>{copy.heading}</h1>
    <p className="team-hero-description">{copy.description}</p>
  </header>;
}
