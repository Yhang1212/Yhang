import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import fridge from '../assets/images/fridge.svg';
import '../components/common/BrandLogo.css';
import './LoginPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LoginPage({ onNavigate }) {
  const [mode, setMode] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    const endpoint = mode === 'signup' ? '/auth/register' : mode === 'forgot' ? '/auth/forgot-password' : '/auth/login';
    const payload = mode === 'signup'
      ? { name: formData.name, email: formData.email, password: formData.password }
      : mode === 'forgot' ? { email: formData.email } : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Please try again.');
      if (mode === 'forgot') {
        setMessage('If the account exists, reset instructions will be sent.');
        return;
      }
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      onNavigate('home');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Welcome back';

  return (
    <main className="auth-page">
      <a className="auth-brand" href="#home" onClick={() => onNavigate('home')}><BrandLogo /></a>
      <section className="auth-shell">
        <div className="auth-promo">
          <span className="auth-kicker">HAILANG · MADE FOR HOME</span>
          <div className="auth-product"><img src={fridge} alt="" /></div>
          <div className="auth-promo-copy">
            <p>Comfort, considered.</p>
            <h1>Good living<br />starts at home.</h1>
            <span>Discover intelligent cooling, shaped around the way you live.</span>
          </div>
          <span className="auth-promo-index">01 — 03</span>
        </div>

        <div className="auth-panel">
          <div className="auth-heading">
            <p className="eyebrow">Your Hailang account</p>
            <h2>{title}</h2>
            <p>{mode === 'forgot' ? 'Enter the email address linked to your account.' : 'Sign in to keep your home experience close at hand.'}</p>
          </div>

          {mode !== 'forgot' ? (
            <div className="auth-tabs" role="tablist" aria-label="Account access">
              <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setMessage(''); }}>Sign in</button>
              <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setMessage(''); }}>Create account</button>
            </div>
          ) : (
            <button className="auth-back" type="button" onClick={() => { setMode('signin'); setMessage(''); }}><ArrowLeft size={15} /> Back to sign in</button>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label>Full name<input name="name" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Your name" required /></label>
            )}
            <label>Email address<input name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required /></label>
            {mode !== 'forgot' && (
              <label>Password<input name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={formData.password} onChange={handleChange} placeholder="Enter your password" minLength={8} required /></label>
            )}
            {mode === 'signin' && <button type="button" className="auth-forgot" onClick={() => { setMode('forgot'); setMessage(''); }}>Forgot password?</button>}
            <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Please wait…' : mode === 'forgot' ? 'Send reset instructions' : mode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
          </form>

          {message && <p className="auth-message" role="status"><CheckCircle2 size={16} />{message}</p>}
          <p className="auth-terms">By continuing, you agree to our terms and privacy policy.</p>
          <button className="auth-guest" type="button" onClick={() => onNavigate('home')}>Continue browsing as a guest</button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;

