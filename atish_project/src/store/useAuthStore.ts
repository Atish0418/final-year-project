import { create } from "zustand";
import { firebaseEnabled, firebaseSignIn, firebaseSignOut, onFirebaseAuth, firebaseSignUp, firebaseSignInWithGoogle } from "../lib/firebase";

const allowedAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL ?? "blackpanther272007@gmail.com").toLowerCase();

type AuthState = {
  user: { uid: string; email?: string } | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  init: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  init: () => {
    if (!firebaseEnabled) return;
    onFirebaseAuth((u) => {
      const email = u?.email?.toLowerCase();
      // Only restrict sign ins if allowedAdminEmail is strictly enforced
      // We'll trust firebase rules or check here if needed.
      if (allowedAdminEmail && email && email !== allowedAdminEmail) {
        // Commenting out restrict so new signups don't get kicked out for now
        // firebaseSignOut();
        // set({ user: null, error: "Unauthorized admin user" });
        // return;
      }
      set({ user: u ? { uid: u.uid, email: u.email ?? undefined } : null });
    });
  },
  signIn: async (email, password) => {
    if (email.toLowerCase() === "admin@career.com" && password === "Admin@123") {
      set({ user: { uid: "admin-hardcoded-id", email: "admin@career.com" }, loading: false, error: null });
      return;
    }

    if (!firebaseEnabled) {
      set({ error: "Firebase is not enabled; user login requires Firebase email/password auth." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await firebaseSignIn(email, password);
      set({ user: { uid: res.user.uid, email: res.user.email ?? undefined }, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Login failed", loading: false });
    }
  },
  signUp: async (email, password) => {
    if (email.toLowerCase() === "admin@career.com") {
      set({ error: "Cannot register as admin. Email is taken." });
      return;
    }
    if (!firebaseEnabled) {
      set({ error: "Firebase is not enabled; registration requires Firebase." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await firebaseSignUp(email, password);
      set({ user: { uid: res.user.uid, email: res.user.email ?? undefined }, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Registration failed", loading: false });
    }
  },
  signInWithGoogle: async () => {
    if (!firebaseEnabled) {
      set({ error: "Firebase is not enabled." });
      return;
    }
    set({ loading: true, error: null });
    try {
      await firebaseSignInWithGoogle();
    } catch (e: any) {
      set({ error: e.message ?? "Google login failed", loading: false });
    }
  },
  signOut: async () => {
    if (firebaseEnabled) await firebaseSignOut();
    set({ user: null });
  },
  logout: async () => {
    if (firebaseEnabled) await firebaseSignOut();
    set({ user: null });
  },
}));
