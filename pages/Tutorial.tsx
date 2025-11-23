import React from 'react';

const Step: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-ops-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 z-10">
        {num}
      </div>
      <div className="w-0.5 flex-grow bg-slate-800 my-2"></div>
    </div>
    <div className="pb-12">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="text-slate-400 leading-relaxed text-lg space-y-4">
        {children}
      </div>
    </div>
  </div>
);

export const Tutorial: React.FC = () => {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">Getting Started Guide</h1>
          <p className="text-lg text-slate-400">
            A step-by-step tutorial to setting up your first autonomous debugging agent.
          </p>
        </div>

        <div className="bg-ops-panel/20 border border-ops-border rounded-2xl p-8 md:p-12">
          
          <Step num="1" title="Configure the Agent">
            <p>
              After logging in, click the <strong>Settings</strong> icon in the dashboard header.
              You will need to provide a <code className="bg-slate-800 text-white px-1 py-0.5 rounded text-sm font-mono">Gemini API Key</code>.
            </p>
            <p className="text-sm bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r">
              <strong>Note:</strong> We do not store your API key on our servers. It is kept in your browser's local storage for security.
            </p>
          </Step>

          <Step num="2" title="Connect Data Sources">
            <p>
              DebugOps supports two modes of operation:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Manual Mode:</strong> Paste stack traces or upload log files directly via the "Manual Input" button.</li>
              <li><strong>Sentry Mode:</strong> Add your Sentry DSN in settings to automatically stream errors from your production app.</li>
            </ul>
          </Step>

          <Step num="3" title="Reviewing Analysis">
            <p>
              When an error appears in the feed, click it. The central panel will show the <strong>Agent Timeline</strong>.
              This log shows you exactly what the AI is thinking, which files it is checking, and how it is diagnosing the problem.
            </p>
          </Step>

          <Step num="4" title="Applying the Fix">
            <p>
              Once analysis is complete, the right-hand panel will display the <strong>Patch Solution</strong>.
              This includes the root cause, severity level, and a code diff.
            </p>
            <p>
              Review the code carefully. If it looks correct, click <strong>Apply Patch</strong> to mark the incident as resolved and (optionally) trigger a deployment webhook.
            </p>
          </Step>

        </div>
      </div>
    </div>
  );
};