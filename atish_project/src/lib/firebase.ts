import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type Auth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  type Firestore,
} from "firebase/firestore";

const getEnv = (key: string) => import.meta.env[key] as string | undefined;

const FALLBACK_CONFIG = {
  apiKey: "AIzaSyBb9CzrOacnPr58tMz_A0ufogrkNS1O6II",
  authDomain: "futurepath-3d.firebaseapp.com",
  projectId: "futurepath-3d",
  storageBucket: "futurepath-3d.firebasestorage.app",
  messagingSenderId: "8786070450",
  appId: "1:8786070450:web:f822dd7e849f9c02a1f2ab",
  measurementId: "G-T4DPFXWXWP",
};

const config = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || FALLBACK_CONFIG.apiKey,
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || FALLBACK_CONFIG.authDomain,
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || FALLBACK_CONFIG.projectId,
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || FALLBACK_CONFIG.storageBucket,
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || FALLBACK_CONFIG.messagingSenderId,
  appId: getEnv("VITE_FIREBASE_APP_ID") || FALLBACK_CONFIG.appId,
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID") || FALLBACK_CONFIG.measurementId,
};

const hasConfig = Object.values(config).every(Boolean);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const initFirebase = () => {
  if (app || !hasConfig) return { app, auth, db, enabled: !!app };
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  return { app, auth, db, enabled: true };
};

export const firebaseEnabled = hasConfig;

export const firebaseAuth = () => {
  if (!auth) initFirebase();
  return auth;
};

export const firebaseDb = () => {
  if (!db) initFirebase();
  return db;
};

export const firebaseSignUp = (email: string, password: string) => {
  const a = firebaseAuth();
  if (!a) throw new Error("Firebase not configured");
  return createUserWithEmailAndPassword(a, email, password);
};

export const firebaseSignIn = (email: string, password: string) => {
  const a = firebaseAuth();
  if (!a) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(a, email, password);
};

export const firebaseSignInWithGoogle = () => {
  const a = firebaseAuth();
  if (!a) throw new Error("Firebase not configured");
  const provider = new GoogleAuthProvider();
  return signInWithPopup(a, provider);
};

export const firebaseSignOut = () => {
  const a = firebaseAuth();
  if (!a) return Promise.resolve();
  return signOut(a);
};

export const onFirebaseAuth = (callback: (user: any) => void) => {
  const a = firebaseAuth();
  if (!a) return () => {};
  return onAuthStateChanged(a, callback);
};

export const fetchCollection = async (name: string) => {
  const database = firebaseDb();
  if (!database) throw new Error("Firebase not configured");
  const snapshot = await getDocs(collection(database, name));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
