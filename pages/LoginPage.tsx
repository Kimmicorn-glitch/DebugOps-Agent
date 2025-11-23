import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword } from '../services/authService';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearState = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleGoogleLogin = async () => {
    clearState();
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode === 'SIGNUP' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (mode === 'SIGNUP' && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'LOGIN') {
        await loginWithEmail(email, password);
        navigate('/dashboard');
      } else {
        await registerWithEmail(email, password);
        setSuccessMsg("Account created! A verification email has been sent to your inbox.");
        setMode('LOGIN'); // Switch back to login to force them to sign in
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg("Password reset link sent! Check your email.");
      setTimeout(() => setMode('LOGIN'), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ops-bg flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-6 hover:scale-105 transition-transform">
            D
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {mode === 'LOGIN' ? 'Welcome Back' : mode === 'SIGNUP' ? 'Create Account' : 'Reset Password'}
          </h1>
          <p className="text-slate-400">
            {mode === 'LOGIN' ? 'Sign in to access your Agent Command Center' : mode === 'SIGNUP' ? 'Join DebugOps to automate your workflow' : 'Enter your email to restore access'}
          </p>
        </div>

        <div className="bg-ops-panel border border-ops-border rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden">
          
          {/* Tabs */}
          {mode !== 'FORGOT' && (
            <div className="flex border-b border-ops-border">
              <button 
                onClick={() => { setMode('LOGIN'); clearState(); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'LOGIN' ? 'bg-ops-panel text-ops-accent border-b-2 border-ops-accent' : 'bg-ops-panel/50 text-slate-500 hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMode('SIGNUP'); clearState(); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'SIGNUP' ? 'bg-ops-panel text-ops-accent border-b-2 border-ops-accent' : 'bg-ops-panel/50 text-slate-500 hover:text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="p-8">
            {/* Feedback Messages */}
            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={mode === 'FORGOT' ? handleResetPassword : handleEmailAuth} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-10 text-white focus:border-ops-accent outline-none text-sm transition-colors"
                    placeholder="name@company.com"
                  />
                  <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {mode !== 'FORGOT' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Password</label>
                    {mode === 'LOGIN' && (
                      <button 
                        type="button"
                        onClick={() => { setMode('FORGOT'); clearState(); }}
                        className="text-xs text-ops-accent hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-10 text-white focus:border-ops-accent outline-none text-sm transition-colors"
                      placeholder="••••••••"
                    />
                    <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              )}

              {mode === 'SIGNUP' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-10 text-white focus:border-ops-accent outline-none text-sm transition-colors"
                      placeholder="••••••••"
                    />
                    <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:scale-100 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {mode === 'LOGIN' ? 'Access Dashboard' : mode === 'SIGNUP' ? 'Create Account' : 'Send Reset Link'}
              </button>
            </form>

            {mode !== 'FORGOT' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-ops-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-ops-panel px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </>
            )}

            {mode === 'FORGOT' && (
              <button 
                onClick={() => { setMode('LOGIN'); clearState(); }}
                className="w-full mt-4 text-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};