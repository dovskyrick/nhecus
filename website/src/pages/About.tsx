import SectionHead from '../components/SectionHead';
import { useAbout } from '../lib/content';

export default function About() {
  const about = useAbout();
  const paras = about.story.split(/\n\s*\n/);
  return (
    <div className="about">
      <div className="about-text">
        <SectionHead label="About" right="nhecus" title="Ink, mostly." />
        {paras.map((p, i) => (
          <p key={i} className={i === paras.length - 1 && paras.length > 1 ? 'about-punch' : ''}>{p}</p>
        ))}
      </div>
      <figure className="about-photo">
        <span className="card-mat"><img src={about.imageUrl} alt="" /></span>
        <figcaption className="caption-row">
          <span className="mono">nhecus</span><span className="mono">ink pen on paper</span>
        </figcaption>
      </figure>
    </div>
  );
}
