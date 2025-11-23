import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Demo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Incident Detection",
      desc: "The dashboard monitors real-time telemetry. When an exception occurs (e.g., in a React component or API endpoint), it is instantly captured with full stack trace context.",
      visual: (
        <div className="w-full h-full bg-[#0B0F19] p-6 rounded-lg font-mono text-xs overflow-hidden border border-ops-border relative flex flex-col shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                <span className="text-rose-500 font-bold tracking-wider">CRITICAL ALERT</span>
                <span className="text-slate-500 ml-auto">14:02:45 UTC</span>
            </div>
            <div className="space-y-3 text-slate-300 flex-grow font-mono">
                <p><span className="text-blue-400 font-bold">Error:</span> TypeError: Cannot read properties of undefined (reading 'map')</p>
                <div className="pl-4 border-l-2 border-slate-700 space-y-1 text-slate-500">
                    <p>at ProductList (src/components/ProductList.tsx:42:15)</p>
                    <p>at renderWithHooks (react-dom.development.js:16305)</p>
                    <p>at mountIndeterminateComponent (react-dom.development.js:20074)</p>
                    <p>at beginWork (react-dom.development.js:21587)</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">Environment: Production</span>
                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">Version: v2.4.1</span>
                 </div>
                 <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded border border-rose-500/20 text-[10px] font-bold animate-pulse">
                    Triggering Agent...
                 </span>
            </div>
        </div>
      )
    },
    {
      title: "2. AI Reasoning",
      desc: "Gemini 2.5 analyzes the stack trace against the source code. It builds a context window and identifies that the 'items' prop is missing validation.",
      visual: (
        <div className="w-full h-full bg-ops-panel p-6 rounded-lg border border-ops-border relative overflow-hidden flex flex-col gap-6 shadow-2xl">
             <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between mb-1 text-xs font-bold text-ops-text-main">
                        <span>ANALYZING CONTEXT</span>
                        <span>85%</span>
                    </div>
                    <div className="h-2 bg-ops-bg rounded-full overflow-hidden border border-ops-border">
                        <div className="h-full bg-blue-500 w-5/6 animate-pulse"></div>
                    </div>
                </div>
             </div>
             <div className="space-y-3 bg-ops-bg/50 p-4 rounded-lg border border-ops-border">
                 <div className="flex items-center gap-3 text-sm text-ops-text-muted">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">✓</div>
                    <span>Parsed Stack Trace & Variable State</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-ops-text-muted">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">✓</div>
                    <span>Retrieved Component: ProductList.tsx</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-blue-400 font-bold animate-pulse">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                    <span>Formulating Hypothesis...</span>
                 </div>
             </div>
             <div className="mt-auto bg-slate-900/80 p-3 rounded text-xs text-slate-300 font-mono border border-slate-700 shadow-inner">
                <span className="text-blue-400">Agent:</span> The variable `products` is likely null/undefined when the API fetch fails. Recommended fix: Add optional chaining or default value.
             </div>
        </div>
      )
    },
    {
      title: "3. Automated Patch",
      desc: "The agent generates a specific JSON code patch to fix the root cause, providing a side-by-side diff and severity assessment.",
      visual: (
        <div className="w-full h-full bg-[#0B0F19] p-6 rounded-lg font-mono text-xs overflow-hidden border border-ops-border flex flex-col shadow-2xl">
            <div className="flex justify-between mb-4 text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">src/components/ProductList.tsx</span>
                <span className="text-emerald-500 flex items-center gap-1 font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Patch Proposed
                </span>
            </div>
            <div className="space-y-1 flex-grow">
                <div className="text-slate-500 pl-4 border-l-2 border-transparent">  return (</div>
                <div className="text-slate-500 pl-4 border-l-2 border-transparent">    &lt;div className="grid gap-4"&gt;</div>
                <div className="bg-rose-900/20 text-rose-400 pl-4 border-l-2 border-rose-500/50">-     &#123;products.map(p =&gt; (</div>
                <div className="bg-emerald-900/20 text-emerald-400 pl-4 border-l-2 border-emerald-500/50">+     &#123;products?.map(p =&gt; (</div>
                <div className="text-slate-500 pl-4 border-l-2 border-transparent">        &lt;ProductCard key=&#123;p.id&#125; data=&#123;p&#125; /&gt;</div>
                <div className="text-slate-500 pl-4 border-l-2 border-transparent">      ))&#125;</div>
                <div className="text-slate-500 pl-4 border-l-2 border-transparent">    &lt;/div&gt;</div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Apply Fix</button>
                <button className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-400 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Reject</button>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-ops-text-main mb-6">Workflow Walkthrough</h1>
          <p className="text-lg text-ops-text-muted max-w-2xl mx-auto">
            Experience how DebugOps transforms a critical failure into a resolved incident in three autonomous steps.
          </p>
        </div>

        {/* Interactive Flow Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
            
            {/* Left Column: Navigation Steps */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                {steps.map((step, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={`text-left p-6 rounded-xl border transition-all duration-300 group
                            ${activeStep === idx 
                                ? 'bg-ops-panel border-ops-accent shadow-lg scale-105 z-10' 
                                : 'bg-ops-panel/30 border-ops-border hover:bg-ops-panel/60 hover:border-ops-border/80'
                            }`}
                    >
                        <h3 className={`text-lg font-bold mb-2 transition-colors ${activeStep === idx ? 'text-ops-accent' : 'text-ops-text-main'}`}>
                            {step.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${activeStep === idx ? 'text-ops-text-main' : 'text-ops-text-muted'}`}>
                            {step.desc}
                        </p>
                    </button>
                ))}
            </div>

            {/* Right Column: Visual Stage */}
            <div className="lg:col-span-8 relative">
                <div className="h-[450px] w-full">
                     {steps.map((step, idx) => (
                        <div 
                            key={idx}
                            className={`absolute inset-0 transition-all duration-500 transform
                                ${activeStep === idx 
                                    ? 'opacity-100 translate-x-0 scale-100 z-10' 
                                    : activeStep > idx 
                                        ? 'opacity-0 -translate-x-10 scale-95 z-0'
                                        : 'opacity-0 translate-x-10 scale-95 z-0'
                                }`}
                        >
                            {step.visual}
                        </div>
                     ))}
                </div>
            </div>

        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-ops-border">
          <div className="bg-ops-panel/50 p-8 rounded-xl border border-ops-border hover:border-ops-accent transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-ops-text-main mb-3">Logs to Logic</h3>
            <p className="text-sm text-ops-text-muted leading-relaxed">
              We don't just regex error messages. The agent understands the semantic meaning of your stack trace and variables.
            </p>
          </div>
          
          <div className="bg-ops-panel/50 p-8 rounded-xl border border-ops-border hover:border-ops-accent transition-all group">
             <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-ops-text-main mb-3">Diff Visualization</h3>
             <p className="text-sm text-ops-text-muted leading-relaxed">
               Review patches in a familiar unified diff format. Smart syntax highlighting makes verification instant.
             </p>
          </div>

          <div className="bg-ops-panel/50 p-8 rounded-xl border border-ops-border hover:border-ops-accent transition-all group flex flex-col justify-between">
             <div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-ops-text-main mb-3">Interactive Sandbox</h3>
                <p className="text-sm text-ops-text-muted leading-relaxed mb-6">
                  Want to try breaking things yourself? Access the live dashboard environment.
                </p>
             </div>
             <Link to="/login" className="block text-center px-4 py-3 bg-ops-accent text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg">
               Launch Console
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
