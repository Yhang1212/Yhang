import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import MegaMenu from './MegaMenu';
import './Navbar.css';
import '../common/BrandLogo.css';

function Navbar({ onNavigate, currentPage = 'home' }) {
  const [menuOpen,setMenuOpen]=useState(false);
  const [productsOpen,setProductsOpen]=useState(false);
  const trigger=useRef(null);
  const closeMenu=()=>{setMenuOpen(false);setProductsOpen(false);};

  useEffect(()=>{
    if(!productsOpen) return undefined;
    const onKeyDown=(event)=>{if(event.key==='Escape'){setProductsOpen(false);trigger.current?.focus();}};
    document.addEventListener('keydown',onKeyDown);
    return ()=>document.removeEventListener('keydown',onKeyDown);
  },[productsOpen]);

  const goToSection=(event,id)=>{
    closeMenu();
    if(currentPage==='home') return;
    event.preventDefault();
    onNavigate('home');
    window.setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),100);
  };
  const goHome=(event)=>{
    closeMenu();
    if(currentPage==='home') return;
    event.preventDefault();
    onNavigate('home');
    window.setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),80);
  };
  const openProduct=(event,slug)=>{
    closeMenu();
    event.preventDefault();
    onNavigate('products', slug);
  };

  return <header className={'navbar' + (currentPage === 'home' ? ' navbar--home' : '')} onMouseLeave={()=>setProductsOpen(false)}>
    <div className="nav-container">
      <a href="#home" aria-label="HAILANG home" onClick={goHome}><BrandLogo /></a>
      <nav id="primary-navigation" className={'desktop-menu'+(menuOpen?' is-open':'')} aria-label="Primary navigation">
        <a href="#home" onClick={goHome}>Home</a>
        <button ref={trigger} className="nav-products-trigger" type="button" aria-expanded={productsOpen} aria-haspopup="true" aria-controls="product-mega-menu" onMouseEnter={()=>setProductsOpen(true)} onClick={()=>setProductsOpen(value=>!value)}>Collection <ChevronDown size={14} aria-hidden="true" /></button>
        <MegaMenu open={productsOpen} onOpenProduct={openProduct} onSection={goToSection}/>
        <a href="#technology" onClick={event=>goToSection(event,'technology')}>Our approach</a>
        <a href="#about" onClick={event=>goToSection(event,'about')}>Why HAILANG</a>
      </nav>
      <div className="nav-actions">
        <button className="login-link" onClick={()=>{closeMenu();onNavigate('login');}}>Sign in</button>
        <a href="#contact" className="contact-btn" onClick={event=>goToSection(event,'contact')}>Let's talk <ArrowUpRight size={15}/></a>
        <button className="menu-toggle" aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={()=>setMenuOpen(value=>!value)}>{menuOpen?<X size={21}/>:<Menu size={21}/>}</button>
      </div>
    </div>
  </header>;
}
export default Navbar;