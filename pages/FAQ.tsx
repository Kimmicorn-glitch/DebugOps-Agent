import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-ops-border rounded-lg bg-ops-panel/50 overflow-hidden hover:border-ops-accent transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-bold text-lg text-ops-text-main">{question}</span>
        <svg 
          className={`w-6 h-6 text-ops-text-dim transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 text-ops-text-muted leading-relaxed border-t border-ops-border/50 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  return (
    <div className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-ops-text-main mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-ops-text-muted">
            Everything you need to know about DebugOps, billing, and security.
          </p>
        </div>

        <div className="space-y-4">
          <FAQItem 
            question="Which AI models does DebugOps use?" 
            answer="We utilize Google's Gemini 2.5 Flash for rapid reasoning and Gemini Pro for complex architectural analysis. The 'Flash' model ensures our latency remains under 2 seconds for standard bug fixes."
          />
          <FAQItem 
            question="Is my code secure?" 
            answer="Absolutely. DebugOps only sends the relevant stack trace and the specific file context associated with the error to the LLM. We do not index your entire repository, and data is processed transiently without being trained on."
          />
          <FAQItem 
            question="Do I need a paid Sentry account?" 
            answer="No, Sentry integration is optional. You can manually submit stack traces via the 'Manual Input' button or upload log files directly to the dashboard for analysis."
          />
          <FAQItem 
            question="Can it auto-deploy fixes?" 
            answer="By default, DebugOps requires human approval (Human-in-the-loop). However, in the settings, you can enable 'Auto-Patch' for Low severity incidents if your CI/CD pipeline supports webhooks."
          />
          <FAQItem 
            question="Is it free to use?" 
            answer="DebugOps is currently in Public Beta and free to use. You simply need your own Gemini API key. Enterprise tiers with team collaboration and history retention will be announced soon."
          />
          <FAQItem
            question="What programming languages are supported?"
            answer="Currently, the agent is optimized for TypeScript, JavaScript, Python, and Go. Support for Rust and Java is coming in Q4 2025."
          />
        </div>
      </div>
    </div>
  );
};