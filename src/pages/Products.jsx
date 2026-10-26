import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ImageOff, Search } from 'lucide-react';
import Container from '../components/common/Container';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { apiRequest } from '../lib/api';
import './Products.css';

const PAGE_SIZE = 9;

function ProductPhoto({ product }) {
  return (
    <div className="product-image-wrap">
      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : (
        <div className="product-image-missing"><ImageOff size={25} aria-hidden="true" /><span>Product image not supplied</span></div>
      )}
    </div>
  );
}

function Products({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(() => new URLSearchParams(window.location.hash.split('?')[1] || '').get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest('/products'), apiRequest('/categories')])
      .then(([productData, categoryData]) => {
        if (!active) return;
        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      })
      .catch((reason) => { if (active) setError(reason.message || 'The catalog could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = products.filter((product) => {
      const categoryMatches = activeCategory === 'all' || product.category?.slug === activeCategory;
      const text = [product.name, product.description, product.category?.name, ...(product.features || []), ...(product.specifications || [])].join(' ').toLowerCase();
      return categoryMatches && (!term || text.includes(term));
    });
    if (sortBy === 'name') matches.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') matches.sort((a, b) => Number(a.price) - Number(b.price));
    return matches;
  }, [products, search, activeCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Navbar onNavigate={onNavigate} currentPage="products" />
      <main className="products-page">
        <Container>
          <header className="products-header">
            <div><p className="eyebrow">HAILANG collection</p><h1>Cooling, chosen for your home.</h1><p>Explore refrigerator, chest freezer, and ice maker products published by HAILANG.</p></div>
            <span className="results-pill">{loading ? 'Loading catalog' : filtered.length + (filtered.length === 1 ? ' product' : ' products')}</span>
          </header>

          <div className="products-toolbar">
            <label className="catalog-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span>
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products" />
            </label>
            <label className="catalog-sort"><span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured first</option><option value="name">Name</option><option value="price">Price entered</option></select>
            </label>
          </div>

          <div className="category-row" aria-label="Filter by category">
            <button className={activeCategory === 'all' ? 'chip active' : 'chip'} onClick={() => { setActiveCategory('all'); setPage(1); }}>All categories</button>
            {categories.map((category) => <button key={category.id} className={activeCategory === category.slug ? 'chip active' : 'chip'} onClick={() => { setActiveCategory(category.slug); setPage(1); }}>{category.name}<span>{category._count?.products ?? products.filter((item) => item.categoryId === category.id).length}</span></button>)}
          </div>

          {error && <div className="catalog-state catalog-error" role="alert"><h2>Catalog unavailable</h2><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>}
          {loading && <div className="catalog-state" role="status">Loading HAILANG products…</div>}
          {!loading && !error && products.length === 0 && <div className="catalog-state"><h2>Product details are being prepared</h2><p>There are no HAILANG product records yet. Product names, photographs, prices, specifications, and warranty details will appear here when an administrator adds verified information.</p></div>}
          {!loading && !error && products.length > 0 && visible.length === 0 && <div className="catalog-state"><h2>No matching products</h2><p>Try another search or choose a different category.</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('all'); setPage(1); }}>Clear filters</button></div>}

          {!loading && !error && visible.length > 0 && <div className="products-grid">
            {visible.map((product) => <article key={product.id} className="product-card">
              <ProductPhoto product={product} />
              <div className="product-body">
                <div className="product-topline"><span>{product.category?.name || 'Uncategorized'}</span>{product.isFeatured && <span className="product-featured">Featured</span>}</div>
                <h2>{product.name}</h2>
                {product.description && <p>{product.description}</p>}
                {product.price !== undefined && product.price !== null && <p className="product-price">Price entered: {Number(product.price).toLocaleString()}</p>}
                {(product.capacity || product.energyRating || product.warranty) && <dl className="product-facts">
                  {product.capacity && <div><dt>Capacity</dt><dd>{product.capacity}</dd></div>}
                  {product.energyRating && <div><dt>Energy rating</dt><dd>{product.energyRating}</dd></div>}
                  {product.warranty && <div><dt>Warranty</dt><dd>{product.warranty}</dd></div>}
                </dl>}
                <a href="#contact" className="product-action" onClick={(event) => { event.preventDefault(); onNavigate?.('home'); window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Ask HAILANG about this product <ArrowRight size={15} aria-hidden="true" /></a>
              </div>
            </article>)}
          </div>}

          {!loading && pageCount > 1 && <nav className="pagination" aria-label="Product pages">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount}>Next</button>
          </nav>}
        </Container>
      </main>
      <Footer onNavigate={onNavigate} currentPage="products" />
    </>
  );
}
export default Products;
