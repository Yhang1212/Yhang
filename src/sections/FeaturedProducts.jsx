import Container from '../components/common/Container';
import './FeaturedProducts.css';
import { ArrowUpRight } from 'lucide-react';

const refrigerators = [
  { id: 1, name: 'Frost Line 4-Door', price: '$2,199', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=900&q=85', category: 'FRENCH DOOR', capacity: '27.8 cu. ft.', finish: 'Matte steel' },
  { id: 2, name: 'Glacier Pro French Door', price: '$2,749', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=900&q=85', category: 'SMART COOLING', capacity: '24.5 cu. ft.', finish: 'Brushed black' },
  { id: 3, name: 'Nordik Counter-Depth', price: '$1,899', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85', category: 'BUILT-IN', capacity: '20.1 cu. ft.', finish: 'Stainless' },
  { id: 4, name: 'Arctic Mini Side-by-Side', price: '$1,449', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85', category: 'COMPACT LIVING', capacity: '16.3 cu. ft.', finish: 'White gloss' },
];

function FeaturedProducts() {
  return (
    <section id="products" className="featured-section">
      <Container>
        <div className="featured-heading">
          <div><p className="eyebrow">The collection</p><h2>Made to fit your<br />kind of living.</h2></div>
          <a href="#contact" className="collection-link">Find your perfect fit <ArrowUpRight size={16} /></a>
        </div>
        <div className="featured-grid">
          {refrigerators.map((item, index) => (
            <article className="featured-card" key={item.id}>
              <a className="featured-image" href="#contact" aria-label={`Ask about ${item.name}`}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="featured-index">0{index + 1}</span>
                <span className="featured-arrow"><ArrowUpRight size={17} /></span>
              </a>
              <div className="featured-meta"><span>{item.category}</span><span>{item.price}</span></div>
              <h3>{item.name}</h3>
              <p>{item.capacity} <span>·</span> {item.finish}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProducts;

