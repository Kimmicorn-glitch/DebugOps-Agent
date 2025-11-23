import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FlowBox: React.FC<{ icon: string; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
  <div className="bg-ops-panel border border-ops-border p-6 rounded-xl flex flex-col items-center text-center relative z-10 hover:border-ops-accent transition-colors shadow-lg">
    <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-4`}>
       <svg className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
       </svg>
    </div>
    <h3 className="text-lg font-bold text-ops-text-main mb-2">{title}</h3>
    <p className="text-sm text-ops-text-muted">{desc}</p>
  </div>
);

const ArrowDown: React.FC = () => (
  <div className="flex justify-center my-4 opacity-30">
    <svg className="w-6 h-6 text-ops-text-dim animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-ops-text-main mb-6">System Architecture</h1>
          <p className="text-lg text-ops-text-muted">
            DebugOps sits between your production environment and your resolution workflow.
            Here is how the autonomous agent processes incidents in real-time.
          </p>
        </div>

        {/* Interactive Visual Flow */}
        <div className="relative space-y-8">
          {/* Vertical Connecting Line */}
          <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500/20 via-emerald-500/20 to-blue-500/20 -translate-x-1/2 -z-10"></div>

          {/* Step 1: Ingestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-right hidden md:block">
               <h3 className="text-xl font-bold text-ops-text-main">1. Event Ingestion</h3>
               <p className="text-ops-text-muted mt-2">Errors are captured via Sentry Webhooks, Firebase Listeners, or direct manual input.</p>
            </div>
            <FlowBox 
              title="Detection Layer" 
              desc="Listeners waiting for exceptions or user uploads."
              icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              color="bg-rose-500"
            />
          </div>

          <ArrowDown />

          {/* Step 2: Processing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
               <FlowBox 
                 title="Gemini Analysis Engine" 
                 desc="Gemini 2.5 Flash analyzes stack traces against source code patterns."
                 icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                 color="bg-blue-500"
               />
            </div>
            <div className="text-left hidden md:block order-1 md:order-2">
               <h3 className="text-xl font-bold text-ops-text-main">2. Cognitive Diagnostics</h3>
               <p className="text-ops-text-muted mt-2">The agent constructs a context window including the stack trace, environment variables, and relevant file snippets.</p>
            </div>
          </div>

          <ArrowDown />

          {/* Step 3: Patch Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-right hidden md:block">
               <h3 className="text-xl font-bold text-ops-text-main">3. Solution Synthesis</h3>
               <p className="text-ops-text-muted mt-2">Valid JSON patches are generated, complete with diffs, explanation, and severity assessment.</p>
            </div>
            <FlowBox 
              title="Patch Generator" 
              desc="Constructs code fixes and explains reasoning."
              icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              color="bg-purple-500"
            />
          </div>

          <ArrowDown />

          {/* Step 4: Resolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
               <FlowBox 
                 title="Deployment & Alerting" 
                 desc="Human-in-the-loop review or auto-merge for low severity."
                 icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                 color="bg-emerald-500"
               />
            </div>
            <div className="text-left hidden md:block order-1 md:order-2">
               <h3 className="text-xl font-bold text-ops-text-main">4. Resolution</h3>
               <p className="text-ops-text-muted mt-2">The incident is marked as resolved, logs are updated, and the team is notified via dashboard.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link to="/demo" className="inline-flex items-center gap-2 text-ops-accent font-bold hover:text-ops-text-main transition-colors">
            See the Demo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};