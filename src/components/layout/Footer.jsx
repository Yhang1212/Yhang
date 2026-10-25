import BrandLogo from '../common/BrandLogo';
import '../common/BrandLogo.css';
import './Footer.css';

const Footer = ({ onNavigate, currentPage = 'home' }) => {
  const sectionLink = (id) => (event) => {
    if (currentPage === 'home') return;
    event.preventDefault();
    onNavigate?.('home');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" aria-label="Hailang home" onClick={sectionLink('home')}><BrandLogo inverse /></a>
            <p>Premium cooling experiences, thoughtfully designed for modern homes.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <strong>Explore</strong>
            <a href="#home" onClick={sectionLink('home')}>Home</a>
            <a href="#products" onClick={sectionLink('products')}>Collection</a>
            <a href="#technology" onClick={sectionLink('technology')}>Our approach</a>
          </nav>
          <div className="footer-contact">
            <strong>Contact</strong>
            <a href="mailto:hello@hailang.com">hello@hailang.com</a>
            <a href="tel:+18005550148">+1 (800) 555-0148</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HAILANG. All rights reserved.</span>
          <span>Made for modern homes.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
