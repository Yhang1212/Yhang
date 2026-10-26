import { ArrowDown, ArrowRight, Leaf, ShieldCheck, Snowflake } from 'lucide-react';
import './Hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="small-title">Modern living, smarter choice</p>
          <h1>Make room<br />for<br /><em>better living.</em></h1>
          <p className="hero-description">Quietly intelligent refrigeration, designed to feel at home in the spaces you love.</p>
          <div className="hero-actions">
            <a href="#products" className="hero-button">Explore the collection <ArrowRight size={16} /></a>
            <a href="#technology" className="hero-text-link">Discover Hailang <ArrowRight size={14} /></a>
          </div>
          <div className="hero-benefits" aria-label="Product benefits">
            <div><Snowflake aria-hidden="true" /><span>Energy Saving<small>Use less, live more</small></span></div>
            <div><ShieldCheck aria-hidden="true" /><span>Fast Cooling<small>Freshness, faster</small></span></div>
            <div><Leaf aria-hidden="true" /><span>Long Lasting<small>Built for your future</small></span></div>
          </div>
        </div>
        <div className="hero-caption">
          <span>01 / OUR SIGNATURE</span>
          <strong>Made for the moments<br />that make a home.</strong>
          <ArrowRight aria-hidden="true" />
        </div>
        <div className="hero-side-label">HAILANG &bull; BETTER HOME</div>
      </div>
      <div className="hero-bottom">
        <span>DESIGNED AROUND YOUR EVERYDAY</span>
        <a href="#products">Scroll to explore <ArrowDown size={13} /></a>
      </div>
    </section>
  );
}

export default Hero;
