import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import './Navbar.css';
import '../common/BrandLogo.css';

function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#home" aria-label="Hailang home" onClick={closeMenu}><BrandLogo /></a>

        <nav className={`desktop-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#products" onClick={closeMenu}>Collection</a>
          <a href="#technology" onClick={closeMenu}>Our approach</a>
          <a href="#about" onClick={closeMenu}>Why Hailang</a>
        </nav>

        <div className="nav-actions">
          <button className="login-link" onClick={() => { closeMenu(); onNavigate('login'); }}>Sign in</button>
          <a href="#contact" className="contact-btn">Let’s talk <ArrowUpRight size={15} /></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;


