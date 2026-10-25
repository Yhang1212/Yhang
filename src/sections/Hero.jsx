import { ArrowDown, ArrowRight } from 'lucide-react';
import './Hero.css';
import fridge from '../assets/images/fridge.svg';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="small-title">Considered design. Everyday ease.</p>
          <h1>Make room for<br /><em>better living.</em></h1>
          <p className="hero-description">Quietly intelligent refrigeration, designed to feel at home in the spaces you love.</p>
          <div className="hero-actions">
            <a href="#products" className="hero-button">Explore the collection <ArrowRight size={16} /></a>
            <a href="#technology" className="hero-text-link">Discover Hailang <ArrowDown size={14} /></a>
          </div>
          <div className="hero-note"><span className="note-dot" /> Thoughtful cooling, made for real life</div>
        </div>
        <div className="hero-visual">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="hero-image-card"><img src={fridge} alt="Hailang premium refrigerator" /></div>
          <div className="hero-caption"><span>01 / OUR SIGNATURE</span><strong>Made for the moments<br />that make a home.</strong></div>
          <div className="hero-side-label">HAILANG · EST. FOR HOME</div>
        </div>
      </div>
      <div className="hero-bottom"><span>DESIGNED AROUND YOUR EVERYDAY</span><a href="#products">Scroll to explore <ArrowDown size={13} /></a></div>
    </section>
  );
}

export default Hero;
