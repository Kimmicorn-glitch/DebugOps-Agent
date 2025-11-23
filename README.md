# DebugOps Agent - Web Application

This is a React-based autonomous agent dashboard designed for real-time error analysis and patching.

## 🚀 How to View the Application

### Option 1: Public Deployment (Get a real URL)
To view the application as a standalone website (outside of the editor) with a shareable URL, deploy it to Firebase Hosting.

1. **Install Firebase Tools** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

   > **Note:** After deployment, the terminal will output a **Hosting URL** (e.g., `https://debugops-demo.web.app`). Click this link to view your live application.

### Option 2: Local Development
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

- **API Keys:** The application uses `constants.ts` to manage configuration. For a production deployment, ensure your build environment has the necessary environment variables (e.g., `REACT_APP_FIREBASE_API_KEY`, `API_KEY`).
- **Routing:** The app uses `HashRouter` by default to ensure compatibility with all hosting environments (including those that don't support server-side rewrites).

## 📂 Project Structure

- **/pages**: Main application views (Dashboard, Landing, Login, etc.).
- **/services**: Logic for Auth, Database (Firebase/Mock), and Gemini AI integration.
- **/components**: Reusable UI elements (ErrorCard, SystemHealth, etc.).
