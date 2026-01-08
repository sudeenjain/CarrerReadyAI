import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "MY API KEY",
  authDomain: "careersnap-1ab4f.firebaseapp.com",
  projectId: "careersnap-1ab4f",
  storageBucket: "careersnap-1ab4f.firebasestorage.app",
  messagingSenderId: "1008016030460",
  appId: "1:1008016030460:web:b7ecc6a6a6b48588bd3579",
  measurementId: "G-G50EN9GW0M"
};

// Singleton initialization pattern for robust ESM registration
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exports with explicit app instance to ensure correct component registration
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Firebase Analytics initialization bypassed.");
  }
}
export { analytics };
