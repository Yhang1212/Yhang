import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LoginPage({ onNavigate }) {
  const [mode, setMode] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    resetEmail: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const endpoint = mode === 'signup' ? '/auth/register' : '/auth/login';
      const payload = mode === 'signup'
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setMessage(mode === 'signup' ? 'Account created successfully.' : 'Signed in successfully.');
      onNavigate('home');
    } catch (error) {
      setMessage(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.resetEmail) {
      setMessage('Enter your email to reset the password.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.resetEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      setMessage('Password reset link has been sent.');
    } catch (error) {
      setMessage(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 45px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p style={{ margin: 0, color: '#1f4ed8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>Welcome</p>
            <h2 style={{ margin: '6px 0 0', fontSize: '28px' }}>{mode === 'signup' ? 'Create account' : 'Sign in'}</h2>
          </div>
          <button onClick={() => onNavigate('home')} style={{ border: 'none', background: 'transparent', color: '#1f4ed8', cursor: 'pointer', fontWeight: 600 }}>
            Continue as guest
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
          <button onClick={() => setMode('signin')} style={{ flex: 1, padding: '10px', borderRadius: '999px', border: mode === 'signin' ? 'none' : '1px solid #dbe3f0', background: mode === 'signin' ? '#1f4ed8' : '#f8fafc', color: mode === 'signin' ? '#fff' : '#0f172a', fontWeight: 700, cursor: 'pointer' }}>
            Sign in with Email
          </button>
          <button onClick={() => setMode('signup')} style={{ flex: 1, padding: '10px', borderRadius: '999px', border: mode === 'signup' ? 'none' : '1px solid #dbe3f0', background: mode === 'signup' ? '#1f4ed8' : '#f8fafc', color: mode === 'signup' ? '#fff' : '#0f172a', fontWeight: 700, cursor: 'pointer' }}>
            Sign up with Email
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          {mode === 'signup' && (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dbe3f0' }}
            />
          )}

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dbe3f0' }}
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dbe3f0' }}
          />

          <button type="submit" disabled={isLoading} style={{ padding: '12px 14px', borderRadius: '12px', border: 'none', background: '#1f4ed8', color: '#fff', fontWeight: 700, cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
          {message && <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', fontSize: '14px' }}>{message}</div>}
          <input
            name="resetEmail"
            type="email"
            value={formData.resetEmail}
            onChange={handleChange}
            placeholder="Email for password reset"
            style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dbe3f0' }}
          />
          <button onClick={handleForgotPassword} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #dbe3f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            Send reset email
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

