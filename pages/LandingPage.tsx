import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-full"> {/* Layout handled by PublicLayout */}
      
      {/* Hero Section */}
      <header className="relative pt-20 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ops-panel border border-ops-border text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-ops-text-main mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Autonomous Debugging <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Powered by Gemini</span>
          </h1>
          
          <p className="text-lg text-ops-text-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            DebugOps connects to your telemetry, identifies root causes using advanced LLMs, and generates deployable patches in seconds. Stop fixing bugs. Start reviewing solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-700 delay-300">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-ops-text-main text-ops-bg font-bold rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              <span>Launch Dashboard</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-ops-panel border border-ops-border text-ops-text-main font-bold rounded-lg hover:border-ops-accent transition-colors flex items-center justify-center gap-2 hover:bg-ops-panel/80">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Navigation Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link to="/how-it-works" className="group relative bg-ops-panel/50 border border-ops-border rounded-2xl p-8 hover:border-ops-accent transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-ops-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
             </div>
             <h3 className="text-2xl font-bold text-ops-text-main mb-4 group-hover:text-blue-400 transition-colors">How It Works</h3>
             <p className="text-ops-text-muted mb-6 leading-relaxed">
               Explore the visual architecture of the agent, from error ingestion to patch generation.
             </p>
             <span className="text-sm font-bold text-ops-accent uppercase tracking-wider flex items-center gap-2">
               View Architecture
               <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </span>
          </Link>

          <Link to="/tutorial" className="group relative bg-ops-panel/50 border border-ops-border rounded-2xl p-8 hover:border-ops-accent transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-ops-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
             </div>
             <h3 className="text-2xl font-bold text-ops-text-main mb-4 group-hover:text-purple-400 transition-colors">Tutorial</h3>
             <p className="text-ops-text-muted mb-6 leading-relaxed">
               Step-by-step guide to connecting your first data source and running the agent.
             </p>
             <span className="text-sm font-bold text-ops-accent uppercase tracking-wider flex items-center gap-2">
               Start Learning
               <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </span>
          </Link>

          <Link to="/faq" className="group relative bg-ops-panel/50 border border-ops-border rounded-2xl p-8 hover:border-ops-accent transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-ops-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h3 className="text-2xl font-bold text-ops-text-main mb-4 group-hover:text-emerald-400 transition-colors">FAQ</h3>
             <p className="text-ops-text-muted mb-6 leading-relaxed">
               Answers to common questions about security, pricing, and integrations.
             </p>
             <span className="text-sm font-bold text-ops-accent uppercase tracking-wider flex items-center gap-2">
               Get Answers
               <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </span>
          </Link>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-ops-bg to-slate-900 border-t border-ops-border">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-ops-text-main mb-6">Ready to automate your maintenance?</h2>
          <p className="text-ops-text-muted mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are sleeping soundly while DebugOps handles the nightly paging alerts.
          </p>
          <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-ops-accent hover:bg-blue-600 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};