import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

// Fallback config for local preview
const activeConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "demo-api-key",
      authDomain: "physio-clinic-demo.firebaseapp.com",
      projectId: "physio-clinic-demo",
      storageBucket: "physio-clinic-demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    };

// Initialize Firebase App & Services
const app = !getApps().length ? initializeApp(activeConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// App Check note: In production with reCAPTCHA v3 or custom provider, call initializeAppCheck(app, { provider: ... });
export default app;
