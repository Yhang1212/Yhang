import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebasePhoneConfigured = Object.values(config).every(Boolean);
export const firebaseAuth = firebasePhoneConfigured
  ? getAuth(getApps().length ? getApp() : initializeApp(config, 'hailang-phone-auth'))
  : null;
