import { useMemo, useState } from 'react';
import Container from '../components/common/Container';
import './Products.css';

const products = [
  {
    id: 1,
    name: 'Frost Line 4-Door',
    price: '$2,199',
    category: 'Cooling',
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=900&q=80',
    description: 'Dual-zone cooling with premium finish and whisper-quiet performance.',
    features: ['No frost', 'Smart temp'],
  },
  {
    id: 2,
    name: 'Glacier Pro French Door',
    price: '$2,749',
    category: 'Smart',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=900&q=80',
    description: 'A refined smart fridge with filtered ice and a sleek premium silhouette.',
    features: ['Touch display', 'Water filter'],
  },
  {
    id: 3,
    name: 'Nordik Counter-Depth',
    price: '$1,899',
    category: 'Built-in',
    tag: 'Editor pick',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    description: 'Designed to blend seamlessly into contemporary kitchens with premium appeal.',
    features: ['Flush fit', 'Quiet drive'],
  },
  {
    id: 4,
    name: 'Arctic Mini Side-by-Side',
    price: '$1,449',
    category: 'Compact',
    tag: 'Compact',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
    description: 'A compact option for apartments, studios, and modern secondary spaces.',
    features: ['Space saving', 'Low energy'],
  },
  {
    id: 5,
    name: 'Luma Double Drawer',
    price: '$1,699',
    category: 'Cooling',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80',
    description: 'Flexible storage with dedicated cooling zones for a premium kitchen flow.',
    features: ['Drawer access', 'Fast chill'],
  },
  {
    id: 6,
    name: 'Aero Flex Refrigerator',
    price: '$2,099',
    category: 'Smart',
    tag: 'Fresh pick',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=900&q=80',
    description: 'Smart cooling technology that keeps your essentials perfectly preserved.',
    features: ['Adaptive sensors', 'App control'],
  },
  {
    id: 7,
    name: 'Silva Premium Cooler',
    price: '$1,299',
    category: 'Compact',
    tag: 'Limited',
    image: 'https://images.unsplash.com/photo-1602532009275-1c3f1f3f2f22?w=900&q=80',
    description: 'Premium compact cooling for kitchens that value elegance and efficiency.',
    features: ['Small footprint', 'Elegant finish'],
  },
  {
    id: 8,
    name: 'North Star Freezer',
    price: '$2,499',
    category: 'Built-in',
    tag: 'Luxury',
    image: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=900&q=80',
    description: 'High-capacity freezing with design-forward detail and dependable performance.',
    features: ['Deep freeze', 'Quiet motor'],
  },
];

const categories = ['All', 'Cooling', 'Smart', 'Built-in', 'Compact'];
const pageSize = 4;

function Products() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price') {
        return Number(a.price.replace(/[^\d]/g, '')) - Number(b.price.replace(/[^\d]/g, ''));
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return sorted;
  }, [search, activeCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  const changePage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return (
    <section className="products-page">
      <Container>
        <div className="products-shell">
          <div className="products-header">
            <div>
              <p className="section-eyebrow">Collection</p>
              <h1>Discover premium appliances.</h1>
              <p>
                Browse a refined selection of cooling solutions built for modern homes, thoughtful design, and dependable daily performance.
              </p>
            </div>
            <div className="results-pill">{filteredProducts.length} products</div>
          </div>

          <div className="products-toolbar">
            <label className="search-field">
              <span>Search</span>
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or feature"
              />
            </label>

            <label className="filter-field">
              <span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          <div className="category-row" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setPage(1);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {pagedProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                </div>

                <div className="product-body">
                  <div className="product-topline">
                    <span>{product.category}</span>
                    <strong>{product.price}</strong>
                  </div>

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="feature-list">
                    {product.features.map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>

                  <button type="button" className="product-action">
                    Preview Product
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button type="button" onClick={() => changePage(safePage - 1)} disabled={safePage === 1}>
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={pageNumber === safePage ? 'page-active' : ''}
                onClick={() => changePage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button type="button" onClick={() => changePage(safePage + 1)} disabled={safePage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Products;
