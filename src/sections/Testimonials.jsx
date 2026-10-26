import Container from '../components/common/Container';
import './Testimonials.css';

const principles = [
  { number: '01', title: 'A clear collection', detail: 'Product categories make it easier to find the kind of cooling you need.' },
  { number: '02', title: 'Useful details', detail: 'Product specifications are shown when HAILANG has supplied them.' },
  { number: '03', title: 'Direct questions', detail: 'Use the inquiry form to ask the HAILANG team about a product.' },
];

function Testimonials() {
  return <section id="testimonials" className="testimonials-section"><Container>
    <div className="section-heading"><p className="eyebrow">A considered experience</p><h2>Product information, clearly presented.</h2><p>We show the details available in the HAILANG catalog and keep unavailable information visible as missing.</p></div>
    <div className="testimonial-grid">{principles.map((item) => <article key={item.number} className="testimonial-card"><span className="benefit-number">{item.number}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>
  </Container></section>;
}
export default Testimonials;
