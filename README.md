# DebugOps Agent - Web Application

This is a React-based autonomous agent dashboard designed for real-time error analysis and patching.

## 🚀 Deployment Instructions

### Option 1: Vercel (Recommended)
The easiest way to publish this app is via Vercel.

1. Push this code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click "Add New > Project".
3. Import your repository.
4. Vercel will automatically detect `vite` and configure the build settings.
5. Click **Deploy**.

### Option 2: Firebase Hosting
To view the application as a standalone website (outside of the editor) with a shareable URL, deploy it to Firebase Hosting.

1. **Install Firebase Tools** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Install Dependencies & Build**:
   ```bash
   npm install
   npm run build
   ```
   *This will create a `dist` folder containing the production-ready app.*

4. **Deploy**:
   ```bash
   firebase deploy
   ```
   *Firebase will give you a unique `Hosting URL` (e.g., `https://your-project.web.app`).*

### Option 3: Local Development
To view the application running on your local machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔧 Configuration

- **Environment Variables:**
  Create a `.env` file for local development or set these variables in your hosting provider's dashboard:
  ```
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  ```
- **Gemini API:**
  The API key for Gemini is stored in the browser's Local Storage for the demo. For a production app, consider moving the API calls to a secure backend (like the provided Cloud Functions).

## 📂 Project Structure

- **/pages**: Main application views (Dashboard, Landing, Login, etc.).
- **/services**: Logic for Auth, Database (Firebase/Mock), and Gemini AI integration.
- **/components**: Reusable UI elements (ErrorCard, SystemHealth, etc.).
- **vite.config.ts**: Build configuration.
