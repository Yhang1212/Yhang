import { ArrowUpRight, ImageOff } from 'lucide-react';

function ProductCard({ product: category, onOpen }) {
  const hasImage = category.slug === 'refrigerators';
  return (
    <a className="mega-product-card" href={'#/products?category=' + category.slug} onClick={(event) => onOpen(event, category.slug)}>
      <span className="mega-product-badge">{category.index}</span>
      <span className="mega-product-image">
        {hasImage ? <img src={category.image} alt="" loading="lazy" /> : <span className="mega-product-missing"><ImageOff size={20} aria-hidden="true" /><small>Image not supplied</small></span>}
        <ArrowUpRight size={14} aria-hidden="true" />
      </span>
      <span className="mega-product-title">{category.title}</span>
    </a>
  );
}
export default ProductCard;
