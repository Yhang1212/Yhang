import BrandLogo from '../common/BrandLogo';
import '../common/BrandLogo.css';

const Footer = () => {
  return (
    <footer id="contact" style={{ background: 'linear-gradient(135deg, #123b63 0%, #1b61ac 100%)', color: '#cbd5e1', padding: '3rem 0 2.25rem' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: '320px' }}>
            <BrandLogo inverse />
            <p style={{ marginBottom: 0, color: '#94a3b8' }}>Premium cooling experiences crafted for ambitious homes and refined living spaces.</p>
          </div>

          <div>
            <p style={{ marginBottom: '0.6rem', color: '#fff', fontWeight: 600 }}>Explore</p>
            <p style={{ marginBottom: '0.35rem' }}><a href="#home" style={{ color: '#cbd5e1' }}>Home</a></p>
            <p style={{ marginBottom: '0.35rem' }}><a href="#products" style={{ color: '#cbd5e1' }}>Products</a></p>
            <p style={{ marginBottom: 0 }}><a href="#technology" style={{ color: '#cbd5e1' }}>Technology</a></p>
          </div>

          <div>
            <p style={{ marginBottom: '0.6rem', color: '#fff', fontWeight: 600 }}>Contact</p>
            <p style={{ marginBottom: '0.35rem' }}>hello@hailang.com</p>
            <p style={{ marginBottom: 0 }}>+1 (800) 555-0148</p>
          </div>
        </div>

        <div style={{ marginTop: '1.6rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.35rem' }}>© 2026 HAILANG. All rights reserved.</p>
          <p style={{ marginBottom: 0, color: '#94a3b8' }}>Made for modern homes that value comfort and design.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;




