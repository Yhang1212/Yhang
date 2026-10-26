import Container from '../components/common/Container';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import refrigeratorImage from '../assets/images/fridge.svg';
import './FeaturedProducts.css';

const categories = [
  { number: '01', slug: 'refrigerators', name: 'Refrigerators', description: 'Explore HAILANG refrigerator products.', image: refrigeratorImage },
  { number: '02', slug: 'chest-freezers', name: 'Chest Freezers', description: 'Browse HAILANG chest freezer products.', image: null },
  { number: '03', slug: 'ice-makers', name: 'Ice Makers', description: 'Browse HAILANG ice maker products.', image: null },
];

function FeaturedProducts({ onNavigate }) {
  const openCategory = (event, slug) => {
    event.preventDefault();
    onNavigate?.('products', slug);
  };

  return (
    <section id="products" className="featured-section">
      <Container>
        <div className="featured-heading">
          <div><p className="eyebrow">The collection</p><h2>Made to fit your<br />kind of living.</h2></div>
          <a className="collection-link" href="#/products" onClick={(event) => { event.preventDefault(); onNavigate?.('products'); }}>View the full collection <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="featured-grid">
          {categories.map((category) => (
            <a className="featured-card" href={'#/products?category=' + category.slug} onClick={(event) => openCategory(event, category.slug)} key={category.slug}>
              <div className={'featured-image' + (category.image ? ' has-image' : ' missing-image')}>
                {category.image ? <img src={category.image} alt="HAILANG refrigerator illustration" loading="lazy" /> : <div className="missing-image-note"><ImageOff size={28} aria-hidden="true" /><span>HAILANG product image not supplied</span></div>}
                <span className="featured-index">{category.number}</span><span className="featured-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
              </div>
              <div className="featured-copy"><h3>{category.name}</h3><p>{category.description}</p></div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
export default FeaturedProducts;
