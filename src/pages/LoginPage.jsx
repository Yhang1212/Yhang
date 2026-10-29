import { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Feather, LockKeyhole, Mail, Phone, ShieldCheck, Snowflake } from 'lucide-react';
import refrigerator from '../assets/images/auth-refrigerator.svg';
import GoogleSignIn, { GOOGLE_CLIENT_ID } from '../components/auth/GoogleSignIn';
import { apiRequest, saveSession } from '../lib/api';
import { firebaseAuth, firebasePhoneConfigured } from '../lib/firebase';
import './LoginPage.css';

const firebaseSetupText = 'Phone sign-in needs Firebase web settings (VITE_FIREBASE_*) and Firebase Admin credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).';
function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetInfo, setResetInfo] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [providerConfig, setProviderConfig] = useState({ google: false, phone: false });
  const confirmation = useRef(null);
  const verifier = useRef(null);

  useEffect(() => {
    let active = true;
    apiRequest('/auth/providers').then((value) => { if (active) setProviderConfig(value); }).catch(() => { if (active) setProviderConfig({ google: false, phone: false }); });
    return () => { active = false; };
  }, []);

  const googleReady = Boolean(GOOGLE_CLIENT_ID && providerConfig.google);
  const phoneReady = Boolean(firebasePhoneConfigured && providerConfig.phone);
  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown > 0]);

  useEffect(() => () => { verifier.current?.clear(); }, []);

  const finishLogin = async (session) => {
    if (!session.accessToken || !session.refreshToken || !session.user) throw new Error('The authentication service returned an incomplete sign-in response.');
    saveSession(session);
    onNavigate(session.user.role === 'ADMIN' ? 'admin' : 'home');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      await finishLogin(session);
    } catch (reason) {
      setError(reason.message || 'Sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const googleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) { setError('Google did not return an identity token. Try again.'); return; }
    setError('');
    setLoading(true);
    try {
      const session = await apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ credential: credentialResponse.credential }) });
      await finishLogin(session);
    } catch (reason) {
      setError(reason.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneCode = async (event) => {
    event?.preventDefault();
    setError('');
    if (!phoneReady || !firebaseAuth) { setError(firebaseSetupText); return; }
    const localNumber = phone.replace(/\D/g, '').replace(/^0/, '');
    if (!/^[1-9]\d{7,8}$/.test(localNumber)) { setError('Enter a valid Cambodia phone number. Include the local number without +855.'); return; }
    setLoading(true);
    try {
      if (verifier.current) { verifier.current.clear(); verifier.current = null; }
      verifier.current = new RecaptchaVerifier(firebaseAuth, 'phone-recaptcha-container', { size: 'normal' });
      confirmation.current = await signInWithPhoneNumber(firebaseAuth, '+855' + localNumber, verifier.current);
      setCodeSent(true);
      setCooldown(30);
      setCode('');
    } catch (reason) {
      verifier.current?.clear();
      verifier.current = null;
      const codeName = reason?.code || '';
      setError(codeName === 'auth/too-many-requests' ? 'Too many SMS attempts. Please wait before requesting another code.' : reason.message || 'Could not send a verification code. Check your number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async (event) => {
    event.preventDefault();
    if (!confirmation.current || !/^\d{6}$/.test(code)) { setError('Enter the six-digit code sent to your phone.'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await confirmation.current.confirm(code);
      const idToken = await result.user.getIdToken();
      const session = await apiRequest('/auth/phone', { method: 'POST', body: JSON.stringify({ idToken }) });
      await signOut(firebaseAuth);
      await finishLogin(session);
    } catch (reason) {
      if (firebaseAuth) await signOut(firebaseAuth).catch(() => {});
      const codeName = reason?.code || '';
      setError(codeName === 'auth/invalid-verification-code' ? 'That verification code is incorrect. Check the message and try again.' : reason.message || 'Phone verification could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-page--login">
      <section className="auth-shell auth-shell--login" aria-labelledby="auth-title">
        <div className="auth-promo">
          <div className="auth-brand-row">
            <a className="auth-brand-lockup" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home'); }} aria-label="HAILANG home">
              <span>HAILANG</span>
            </a>
            <span className="auth-tagline">Better Cooling <b>&middot;</b> Better Living</span>
          </div>
          <div className="auth-promo-copy">
            <h1>A cooler home.<br />A better everyday.</h1>
            <p>Thoughtful refrigeration, designed around the way you live.</p>
          </div>
          <div className="auth-visual"><img src={refrigerator} alt="HAILANG refrigerator" /></div>
          <div className="auth-features">
            <span><Snowflake size={17} /> Energy Saving</span>
            <span><ShieldCheck size={17} /> Fast Cooling</span>
            <span><Feather size={17} /> Long Lasting</span>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-top">Secure member sign-in</div>
          <div className="auth-heading">
            <p className="eyebrow">HAILANG account</p>
            <h2 id="auth-title">{showPhone ? 'Sign in with phone' : 'Welcome Back'}</h2>
            <p>{showPhone ? 'Verify your Cambodia phone number with a one-time code.' : 'Sign in to your account and continue with HAILANG.'}</p>
          </div>
          {showPhone ? <section className="auth-phone-flow" aria-label="Phone number verification">
            {!phoneReady && <p className="auth-info" role="status">{firebaseSetupText} Configure the Firebase web settings before enabling SMS.</p>}
            {!codeSent ? <form className="auth-form" onSubmit={sendPhoneCode}>
              <label htmlFor="login-phone">Cambodia phone number</label>
              <div className="auth-phone-input"><span aria-hidden="true">+855</span><input id="login-phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="12 345 678" maxLength={14} disabled={!phoneReady} /></div>
              {phoneReady && <div id="phone-recaptcha-container" className="auth-recaptcha" aria-label="Security verification" />}
              {error && <p className="auth-error" role="alert"><AlertCircle size={17} />{error}</p>}
              {phoneReady && <p className="auth-provider-note">SMS verification is protected by Firebase reCAPTCHA and provider limits.</p>}
              <button className="auth-submit" type="submit" disabled={loading || !phoneReady}>{loading ? <><span className="auth-spinner" /> Sending code…</> : <>Send verification code <ArrowRight size={16} /></>}</button>
            </form> : <form className="auth-form" onSubmit={verifyPhoneCode}>
              <p className="auth-phone-sent">Enter the verification code sent to +855 {phone}</p>
              <label htmlFor="phone-code">Six-digit code</label>
              <input id="phone-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} required />
              <p className="auth-provider-note">Firebase expires verification codes automatically. Request a new code if this one expires.</p>
              {error && <p className="auth-error" role="alert"><AlertCircle size={17} />{error}</p>}
              <button className="auth-submit" type="submit" disabled={loading || code.length !== 6}>{loading ? <><span className="auth-spinner" /> Verifying…</> : <>Verify and sign in <ArrowRight size={16} /></>}</button>
              <button className="auth-resend" type="button" disabled={loading || cooldown > 0} onClick={sendPhoneCode}>{cooldown > 0 ? 'Resend code in ' + cooldown + 's' : 'Resend verification code'}</button>
            </form>}
            <button className="auth-back-method" type="button" onClick={() => { setShowPhone(false); setCodeSent(false); setError(''); setCooldown(0); confirmation.current = null; verifier.current?.clear(); verifier.current = null; }}><ArrowLeft size={14}/> Back to email sign-in</button>
          </section> : <>
            <form className="auth-form" onSubmit={submit}>
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-field"><Mail size={16} aria-hidden="true" /><input className="auth-icon-input" id="login-email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" maxLength={254} required /></div>
              <div className="auth-password-label"><label htmlFor="login-password">Password</label><button type="button" className="auth-forgot" aria-expanded={resetInfo} onClick={() => setResetInfo((value) => !value)}>Forgot password?</button></div>
              <div className="auth-password-field">
                <LockKeyhole className="auth-field-icon" size={16} aria-hidden="true" /><input className="auth-icon-input" id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
                <button type="button" className="auth-visibility" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              {resetInfo && <p className="auth-info" role="status">Password reset email delivery is not configured. Contact the administrator to reset your account.</p>}
              {error && <p className="auth-error" role="alert"><AlertCircle size={17} />{error}</p>}
              <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}</button>
            </form>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="auth-login-providers">
              <GoogleSignIn configured={googleReady} clientId={GOOGLE_CLIENT_ID} onSuccess={googleSuccess} onError={() => setError('Google sign-in was cancelled or could not be completed. Try again.')} />
              <button type="button" className="auth-provider-button auth-phone-button" onClick={() => { setShowPhone(true); setError(''); }}><Phone size={17}/>Continue with phone number</button>
            </div>
            <p className="auth-create-link">New to HAILANG? <button type="button" onClick={() => onNavigate('create-account')}>Create an account</button></p>
          </>}
          <p className="auth-security">Your credentials are verified by HAILANG's authentication service. Passwords are stored as secure hashes.</p>
        </div>
      </section>
      <footer className="auth-footer">© {new Date().getFullYear()} HAILANG. All rights reserved.</footer>
    </main>
  );
}
export default LoginPage;
