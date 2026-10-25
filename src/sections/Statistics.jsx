import Container from '../components/common/Container';
import './Statistics.css';

const statistics = [
  { value: '24/7', label: 'Smart monitoring' },
  { value: '40%', label: 'Lower energy use' },
  { value: '2Y', label: 'Warranty coverage' },
  { value: '4.9/5', label: 'Average rating' },
];

const Statistics = () => {
  return (
    <section id="stats" className="statistics-section">
      <Container>
        <div className="statistics-shell">
          <div className="section-heading">
            <p className="eyebrow">Performance</p>
            <h2>Built to impress every day.</h2>
            <p>
              Premium cooling meets intelligent design, creating a better kitchen experience from the first touch.
            </p>
          </div>

          <div className="stats-grid">
            {statistics.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Statistics;
