import copy from '../../data/about.json';
import './AboutSection.css';

export default function AboutSection(){
  return <section className="connection-section about-section" id="connection" aria-labelledby="about-title">
    <div className="connection-inner about-inner">
      <div className="about-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="about-title">{copy.title}</h2>
      </div>
      <div className="about-copy">
        <p className="about-lead">{copy.lead}</p>
        {copy.paragraphs.map(paragraph=><p className="about-paragraph" key={paragraph}>{paragraph}</p>)}
      </div>
    </div>
  </section>;
}
