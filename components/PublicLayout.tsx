import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path ? 'text-white' : 'text-slate-400 hover:text-white';

  return (
    <div className="min-h-screen bg-ops-bg text-slate-200 font-sans selection:bg-ops-accent selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-ops-border bg-ops-bg/90 backdrop-blur fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/30 transition-all">D</div>
            <span className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">DebugOps</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/how-it-works" className={`text-sm font-medium transition-colors ${isActive('/how-it-works')}`}>How It Works</Link>
              <Link to="/demo" className={`text-sm font-medium transition-colors ${isActive('/demo')}`}>Demo</Link>
              <Link to="/tutorial" className={`text-sm font-medium transition-colors ${isActive('/tutorial')}`}>Tutorial</Link>
              <Link to="/faq" className={`text-sm font-medium transition-colors ${isActive('/faq')}`}>FAQ</Link>
            </div>
            <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-ops-accent hover:bg-blue-600 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
              Console Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 bg-ops-bg border-t border-ops-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">D</div>
            <span className="font-bold text-white">DebugOps</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:support@debugops.ai" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-xs text-slate-600">© 2024 DebugOps Inc. System Status: Normal.</p>
        </div>
      </footer>
    </div>
  );
};