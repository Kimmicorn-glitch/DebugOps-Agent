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

// In a real deployed app, these would be process.env.REACT_APP_FIREBASE_...
// For this standalone demo, we will simulate the backend if no config is present,
// OR use a provided API key for the Gemini Client.
export const FIREBASE_CONFIG = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "debugops-demo.firebaseapp.com",
  projectId: "debugops-demo",
  storageBucket: "debugops-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
