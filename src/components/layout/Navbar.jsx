import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import './Navbar.css';
import '../common/BrandLogo.css';

function Navbar({ onNavigate, currentPage = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const goToSection = (event, id) => {
    closeMenu();
    if (currentPage === 'home') return;
    event.preventDefault();
    onNavigate('home');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const goHome = (event) => {
    closeMenu();
    if (currentPage === 'home') return;
    event.preventDefault();
    onNavigate('home');
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#home" aria-label="Hailang home" onClick={goHome}><BrandLogo /></a>
        <nav className={`desktop-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#home" onClick={goHome}>Home</a>
          <a href="#products" onClick={(event) => goToSection(event, 'products')}>Collection</a>
          <a href="#technology" onClick={(event) => goToSection(event, 'technology')}>Our approach</a>
          <a href="#about" onClick={(event) => goToSection(event, 'about')}>Why Hailang</a>
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={() => { closeMenu(); onNavigate('login'); }}>Sign in</button>
          <a href="#contact" className="contact-btn" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15} /></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

