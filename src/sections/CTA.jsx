import Container from '../components/common/Container';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <Container>
        <div className="cta-shell">
          <div>
            <p className="eyebrow">Ready to upgrade?</p>
            <h2>Bring premium comfort into your space.</h2>
            <p>
              Discover refined cooling solutions crafted for modern homes, elegant kitchens, and everyday performance.
            </p>
          </div>
          <a href="#contact" className="cta-button">Schedule a Consultation</a>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
