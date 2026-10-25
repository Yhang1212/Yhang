import Container from '../components/common/Container';
import './Testimonials.css';

const testimonials = [
  {
    quote:
      'The design feels luxurious, and the cooling performance is better than anything we had before.',
    name: 'Mina Chen',
    role: 'Interior Designer',
  },
  {
    quote:
      'Silent, elegant, and incredibly reliable. It completely elevated our kitchen experience.',
    name: 'Daniel Brooks',
    role: 'Homeowner',
  },
  {
    quote:
      'From setup to daily use, the quality and attention to detail are outstanding.',
    name: 'Ava Morales',
    role: 'Product Consultant',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <Container>
        <div className="section-heading">
          <p className="eyebrow">Testimonials</p>
          <h2>Trusted by clients who value quality.</h2>
          <p>
            Every product is designed to bring lasting comfort and intelligent performance into modern homes.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card">
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;

