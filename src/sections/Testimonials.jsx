import Container from '../components/common/Container';
import './Testimonials.css';

const benefits = [
  { number: '01', title: 'Quiet by design', detail: 'Thoughtful airflow and low-noise operation help keep the kitchen calm.' },
  { number: '02', title: 'Freshness, made simple', detail: 'Smart temperature control keeps everyday ingredients ready for what’s next.' },
  { number: '03', title: 'A natural fit at home', detail: 'Refined finishes and considered proportions bring ease to modern spaces.' },
];

const Testimonials = () => (
  <section id="testimonials" className="testimonials-section">
    <Container>
      <div className="section-heading">
        <p className="eyebrow">The HAILANG difference</p>
        <h2>Little details. Better everyday living.</h2>
        <p>Designed around the routines, spaces, and moments that make a house feel like home.</p>
      </div>
      <div className="testimonial-grid">
        {benefits.map((item) => (
          <article key={item.number} className="testimonial-card">
            <span className="benefit-number">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

export default Testimonials;
