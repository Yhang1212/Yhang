import BrandLogo from '../common/BrandLogo';
import '../common/BrandLogo.css';
import './Footer.css';

function Footer({ onNavigate, currentPage = 'home' }) {
  const sectionLink = (id) => (event) => {
    if (currentPage === 'home') return;
    event.preventDefault();
    onNavigate?.('home');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" aria-label="HAILANG home" onClick={sectionLink('home')}><BrandLogo inverse /></a>
            <p>Home cooling products and company information from HAILANG Cambodia.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <strong>Explore</strong><a href="#home" onClick={sectionLink('home')}>Home</a>
            <a href="#products" onClick={(event) => { event.preventDefault(); onNavigate?.('products'); }}>Collection</a>
            <a href="#technology" onClick={sectionLink('technology')}>Our approach</a>
          </nav>
          <div className="footer-contact"><strong>Contact</strong><a href="#contact" onClick={sectionLink('contact')}>Send an inquiry</a><span>Use the contact form to reach our team.</span></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} HAILANG. All rights reserved.</span><span>HAILANG Cambodia</span></div>
      </div>
    </footer>
  );
}
export default Footer;
