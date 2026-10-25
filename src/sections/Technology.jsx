import Container from '../components/common/Container';
import './Technology.css';

const features = [
  'Advanced cooling sensors that maintain steady temperatures.',
  'Quiet operation with smart airflow management.',
  'Modern interfaces designed for easy everyday use.',
];

const Technology = () => {
  return (
    <section id="technology">
      <Container>
        <div className="section-heading">
          <p className="eyebrow">Technology</p>
          <h2>Innovation that feels effortless.</h2>
          <p>From intelligent temperature control to thoughtful design, every detail is built to perform.</p>
        </div>

        <div className="card-grid">
          {features.map((feature) => (
            <div key={feature} className="card">
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Technology;

