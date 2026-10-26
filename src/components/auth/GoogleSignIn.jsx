import { useEffect, useRef, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
export const GOOGLE_SETUP_TEXT = 'Google sign-in needs the same Google OAuth web client ID in VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID.';

function GoogleSignIn({ configured, clientId = GOOGLE_CLIENT_ID, onSuccess, onError }) {
  const container = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const element = container.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(200, Math.min(360, Math.floor(entry.contentRect.width))));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="auth-google" ref={container}>
      {configured ? (
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            text="continue_with"
            theme="outline"
            shape="rectangular"
            width={String(width)}
          />
        </GoogleOAuthProvider>
      ) : (
        <button type="button" className="auth-provider-button" disabled aria-describedby="google-setup">
          <span className="google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>
      )}
      {!configured && <p className="auth-provider-note" id="google-setup">{GOOGLE_SETUP_TEXT}</p>}
    </div>
  );
}

export default GoogleSignIn;
