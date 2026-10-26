import refrigeratorImage from '../../assets/images/fridge.svg';
import ProductCard from './ProductCard';
import DiscoverList from './DiscoverList';

const categories = [
  { id: 'refrigerators', slug: 'refrigerators', title: 'Refrigerators', index: '01', image: refrigeratorImage },
  { id: 'chest-freezers', slug: 'chest-freezers', title: 'Chest Freezers', index: '02' },
  { id: 'ice-makers', slug: 'ice-makers', title: 'Ice Makers', index: '03' },
];

function MegaMenu({ open, onOpenProduct, onSection }) {
  return <div id="product-mega-menu" className={'mega-menu' + (open ? ' is-open' : '')} aria-hidden={!open}>
    <div className="mega-menu-inner">
      <div className="mega-catalog" aria-label="Product categories">{categories.map((category) => <ProductCard key={category.id} product={category} onOpen={onOpenProduct} />)}</div>
      <DiscoverList onSection={onSection} />
    </div>
  </div>;
}
export default MegaMenu;
