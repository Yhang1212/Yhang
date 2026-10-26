import { Snowflake, House, BadgeCheck, MessagesSquare } from 'lucide-react';
import './WhyChooseUs.css';

const features = [
  { icon: House, title: 'Made for home', desc: 'Explore cooling products for everyday spaces and routines.' },
  { icon: Snowflake, title: 'Cooling categories', desc: 'Browse refrigerators, chest freezers, and ice makers in one place.' },
  { icon: BadgeCheck, title: 'Clear product details', desc: 'Published specifications and warranty information appear with each listing.' },
  { icon: MessagesSquare, title: 'Talk to HAILANG', desc: 'Send the team a question through the website inquiry form.' },
];

export default function WhyChooseUs() {
  return <section id="about" className="why"><div className="container">
    <p className="section-tag">WHY HAILANG</p><h2>Clear choices for everyday cooling.</h2>
    <p className="section-desc">Browse the product range, review the details provided, and ask the HAILANG team when you need more information.</p>
    <div className="feature-grid">{features.map(({ icon: Icon, title, desc }) => <article className="feature-card" key={title}><div className="icon"><Icon size={30} aria-hidden="true" /></div><h3>{title}</h3><p>{desc}</p></article>)}</div>
  </div></section>;
}
