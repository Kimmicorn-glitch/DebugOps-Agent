import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  User 
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { FIREBASE_CONFIG } from "../constants";

// Initialize Firebase if not already done (and if config exists)
// Checking for placeholder ensures we don't init with invalid config in Mock Mode
if (getApps().length === 0 && FIREBASE_CONFIG.apiKey !== "PLACEHOLDER_API_KEY") {
  try {
    const app = initializeApp(FIREBASE_CONFIG);
    console.log(`[DebugOps] Successfully linked to Firebase Project: ${FIREBASE_CONFIG.projectId}`);
  } catch (e) {
    console.warn("[DebugOps] Firebase Init Failed: Config likely invalid.", e);
  }
} else if (getApps().length === 0) {
  console.log("[DebugOps] Running in Demo Mode (Mock Persistence). Link Firebase in Settings to go live.");
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
}

// MOCK USER for Demo purposes if Firebase isn't configured
const MOCK_USER: UserProfile = {
  uid: "mock-user-123",
  displayName: "Demo Engineer",
  email: "engineer@debugops.ai",
  photoURL: "https://ui-avatars.com/api/?name=Demo+Engineer&background=3B82F6&color=fff",
  emailVerified: true
};

const MOCK_DB_KEY = 'debugOps_mock_db';

// Simple hash simulation for mock mode (in real app, use Firebase Auth's built-in hashing)
const mockHash = (str: string) => btoa(str + "_salt_secure");

// Helper to check if real firebase is active
const isFirebaseActive = () => getApps().length > 0;

export const registerWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  if (isFirebaseActive()) {
    const auth = getAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result.user;
  } else {
    // Mock Registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
    if (db[email]) throw new Error("Account already exists for this email.");

    const newUser = {
      uid: 'mock-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=10B981&color=fff`,
      emailVerified: false,
      passwordHash: mockHash(password) // Simulating encrypted storage
    };

    db[email] = newUser;
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
    
    // Auto-login after signup for mock, but strictly we might want them to verify first
    const { passwordHash, ...userProfile } = newUser;
    localStorage.setItem('debugOps_user', JSON.stringify(userProfile));
    
    return userProfile;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  if (isFirebaseActive()) {
    const auth = getAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } else {
    // Mock Login
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const db = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
    const userRecord = db[email];

    if (!userRecord) throw new Error("No account found with this email.");
    if (userRecord.passwordHash !== mockHash(password)) throw new Error("Invalid password.");

    const { passwordHash, ...userProfile } = userRecord;
    localStorage.setItem('debugOps_user', JSON.stringify(userProfile));
    return userProfile;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  if (isFirebaseActive()) {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  } else {
    // Mock Reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    const db = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
    if (!db[email]) throw new Error("No account found with this email.");
    console.log(`[Mock] Password reset email sent to ${email}`);
  }
};

export const signInWithGoogle = async (): Promise<UserProfile> => {
  if (isFirebaseActive()) {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      // In production, we might want to rethrow, but for a hybrid app we can fallback or alert
      throw error;
    }
  } else {
    // Simulate network delay for mock login
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.setItem('debugOps_user', JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }
};

export const signOut = async () => {
  if (isFirebaseActive()) {
    const auth = getAuth();
    await firebaseSignOut(auth);
  }
  localStorage.removeItem('debugOps_user');
};

export const getCurrentUser = (): UserProfile | null => {
  const stored = localStorage.getItem('debugOps_user');
  if (stored) return JSON.parse(stored);
  return null;
};