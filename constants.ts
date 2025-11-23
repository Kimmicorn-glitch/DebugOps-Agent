export const APP_NAME = "DebugOps";
export const APP_VERSION = "1.0.0-alpha";

export const MOCK_ERRORS = [
  {
    message: "ReferenceError: userProfile is not defined",
    stackTrace: "at renderHeader (Header.tsx:42:12)\n    at render (App.tsx:15:5)\n    at ReactReconciler (react-dom.js:1234)",
    sourceFile: "src/components/Header.tsx"
  },
  {
    message: "TypeError: Cannot read properties of null (reading 'map')",
    stackTrace: "at ProductList (ProductList.tsx:28:15)\n    at DataFetcher (api.ts:50:10)",
    sourceFile: "src/components/ProductList.tsx"
  },
  {
    message: "DatabaseConnectionError: Connection timeout after 5000ms",
    stackTrace: "at PostgresClient.connect (db.ts:15:20)\n    at Server.init (server.ts:100:5)",
    sourceFile: "backend/db.ts"
  }
];

// Helper to check for user-provided config in LocalStorage (Dynamic Linking)
const getStoredFirebaseConfig = () => {
  try {
    const stored = localStorage.getItem('debugOps_firebaseConfig');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to parse stored Firebase config", e);
  }
  return null;
};

const storedConfig = getStoredFirebaseConfig();

// Configuration logic for Deployment
// 1. LocalStorage (User entered via Settings UI)
// 2. Environment variables (Build time)
// 3. Fallback to placeholders for Mock Mode
export const FIREBASE_CONFIG = storedConfig || {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "debugops-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "debugops-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "debugops-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};