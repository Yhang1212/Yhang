import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Feather, LockKeyhole, Mail, ShieldCheck, Snowflake, UserRound } from 'lucide-react';
import GoogleSignIn, { GOOGLE_CLIENT_ID } from '../components/auth/GoogleSignIn';
import refrigerator from '../assets/images/auth-refrigerator.svg';
import { apiRequest, saveSession } from '../lib/api';
import './LoginPage.css';

function CreateAccount({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest('/auth/providers')
      .then((providers) => { if (active) setGoogleEnabled(Boolean(providers.google)); })
      .catch(() => { if (active) setGoogleEnabled(false); });
    return () => { active = false; };
  }, []);

  const finishLogin = (session) => {
    if (!session.accessToken || !session.refreshToken || !session.user) {
      throw new Error('The authentication service returned an incomplete sign-in response.');
    }
    saveSession(session);
    onNavigate(session.user.role === 'ADMIN' ? 'admin' : 'home');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (name.trim().length < 2) { setError('Enter your full name (at least 2 characters).'); return; }
    if (password.length < 8) { setError('Choose a password with at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('The passwords do not match.'); return; }
    setLoading(true);
    try {
      const session = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
      finishLogin(session);
    } catch (reason) {
      setError(reason.message || 'Your account could not be created.');
    } finally {
      setLoading(false);
    }
  };

  const googleSuccess = async (credentialResponse) => {
    if (loading) return;
    if (!credentialResponse.credential) { setError('Google did not return an identity token. Try again.'); return; }
    setError('');
    setLoading(true);
    try {
      const session = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      finishLogin(session);
    } catch (reason) {
      setError(reason.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="create-title">
        <div className="auth-promo">
          <div className="auth-brand-row">
            <a className="auth-brand-lockup" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home'); }} aria-label="HAILANG home">
              <span>HAILANG</span>
            </a>
            <span className="auth-tagline">Better Cooling <b>·</b> Better Living</span>
          </div>
          <div className="auth-promo-copy">
            <h1>Freshness<br />For Lifestyle</h1>
            <p>Premium refrigerators for<br />a healthier and better life.</p>
          </div>
          <div className="auth-visual"><img src={refrigerator} alt="HAILANG refrigerator" /></div>
          <div className="auth-features">
            <span><Snowflake size={17} /> Energy Saving</span>
            <span><ShieldCheck size={17} /> Fast Cooling</span>
            <span><Feather size={17} /> Long Lasting</span>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-top"><button type="button" onClick={() => onNavigate('login')}><ArrowLeft size={13} /> Back to sign in</button></div>
          <div className="auth-heading"><p className="eyebrow">HAILANG account</p><h2 id="create-title">Create Account</h2><p>Join HAILANG for a smarter and cooler life.</p></div>
          <form className="auth-form" onSubmit={submit}>
            <label htmlFor="create-name">Full name</label>
            <div className="auth-input-field"><UserRound size={16} aria-hidden="true" /><input className="auth-icon-input" id="create-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={100} required /></div>
            <label htmlFor="create-email">Email address</label>
            <div className="auth-input-field"><Mail size={16} aria-hidden="true" /><input className="auth-icon-input" id="create-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" maxLength={254} required /></div>
            <label htmlFor="create-password">Password</label>
            <div className="auth-password-field"><LockKeyhole className="auth-field-icon" size={16} aria-hidden="true" /><input className="auth-icon-input" id="create-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} maxLength={128} required /><button type="button" className="auth-visibility" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="auth-password-field"><LockKeyhole className="auth-field-icon" size={16} aria-hidden="true" /><input className="auth-icon-input" id="confirm-password" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" minLength={8} maxLength={128} required /><button type="button" className="auth-visibility" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'} aria-pressed={showConfirm}>{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {error && <p className="auth-error" role="alert"><AlertCircle size={17} />{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" />Creating account…</> : <>Create Account <ArrowRight size={16} /></>}</button>
          </form>
          <div className="auth-divider"><span>or sign up with</span></div>
          <GoogleSignIn
            configured={Boolean(GOOGLE_CLIENT_ID && googleEnabled)}
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={googleSuccess}
            onError={() => setError('Google sign-in was cancelled or could not be completed. Try again.')}
          />
          <p className="auth-create-link">Already have an account? <button type="button" onClick={() => onNavigate('login')}>Sign in</button></p>
          <p className="auth-security">New accounts receive standard customer access. Administrator access is assigned separately.</p>
        </div>
      </section>
      <footer className="auth-footer">© {new Date().getFullYear()} HAILANG. All rights reserved.</footer>
    </main>
  );
}

export default CreateAccount;

