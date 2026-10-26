import { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import { apiRequest } from '../lib/api';
import './Statistics.css';

function Statistics() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.all([apiRequest('/products'), apiRequest('/categories')]).then(([products, categories]) => {
      if (active) setCounts({ products: products.length, categories: categories.length, featured: products.filter((item) => item.isFeatured).length });
    }).catch(() => { if (active) setCounts(null); });
    return () => { active = false; };
  }, []);
  const stats = [
    { value: counts ? counts.products : '—', label: 'Product listings' },
    { value: counts ? counts.categories : '—', label: 'Product categories' },
    { value: counts ? counts.featured : '—', label: 'Featured products' },
  ];
  return <section id="stats" className="statistics-section"><Container>
    <div className="statistics-shell">
      <div className="section-heading"><p className="eyebrow">HAILANG collection</p><h2>Explore the range.</h2><p>Counts update from the HAILANG product catalog.</p></div>
      <div className="stats-grid">{stats.map((item) => <div key={item.label} className="stat-card"><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
    </div>
  </Container></section>;
}
export default Statistics;
