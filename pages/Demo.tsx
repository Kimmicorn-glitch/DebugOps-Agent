import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ops-text-main mb-6">Product Demonstration</h1>
          <p className="text-lg text-ops-text-muted max-w-2xl mx-auto">
            Watch DebugOps identify a null pointer exception in a React application and propose a fix in under 3 seconds.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="bg-ops-panel border border-ops-border rounded-2xl shadow-2xl overflow-hidden aspect-video relative group mb-16">
          {isPlaying ? (
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/lxRwEPvL-mQ?autoplay=1&mute=1&controls=1" 
              title="DebugOps Demo" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          ) : (
            <div 
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                 <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M8 5v14l11-7z" />
                 </svg>
              </div>
              
              {/* Overlay Text - Keep white as it's on dark video overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                 <h3 className="text-2xl font-bold text-white">Live Diagnosis: E-Commerce Crash</h3>
                 <p className="text-slate-300">Detailed walkthrough of the agent's reasoning process.</p>
              </div>
            </div>
          )}
          
          {/* Abstract UI Background (Visible only when not playing) */}
          {!isPlaying && (
            <div className="w-full h-full p-12 bg-slate-900 grid grid-cols-2 gap-8 opacity-20 pointer-events-none">
               <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-32 bg-slate-800 rounded border border-slate-700"></div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-slate-800 rounded border border-slate-700"></div>
               </div>
            </div>
          )}
        </div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ops-panel/50 p-6 rounded-xl border border-ops-border hover:border-ops-accent transition-colors">
            <h3 className="font-bold text-ops-text-main mb-2">Real-time Logs</h3>
            <p className="text-sm text-ops-text-muted mb-4">See how the agent parses raw log streams.</p>
            <div className="bg-[#0B0F19] p-3 rounded font-mono text-[10px] text-emerald-400 border border-ops-border">
              > [14:02:11] Error detected<br/>
              > [14:02:12] Agent attached<br/>
              > [14:02:13] Patch generated
            </div>
          </div>
          
          <div className="bg-ops-panel/50 p-6 rounded-xl border border-ops-border hover:border-ops-accent transition-colors">
             <h3 className="font-bold text-ops-text-main mb-2">Diff Viewer</h3>
             <p className="text-sm text-ops-text-muted mb-4">Smart syntax highlighting for proposed changes.</p>
             <div className="bg-[#0B0F19] p-3 rounded font-mono text-[10px] text-slate-300 border border-ops-border">
               <span className="text-rose-500">- user.id</span><br/>
               <span className="text-emerald-500">+ user?.id</span>
             </div>
          </div>

          <div className="bg-ops-panel/50 p-6 rounded-xl border border-ops-border hover:border-ops-accent transition-colors flex flex-col justify-center text-center">
             <h3 className="font-bold text-ops-text-main mb-2">Try it yourself</h3>
             <p className="text-sm text-ops-text-muted mb-6">Access the sandbox environment.</p>
             <Link to="/login" className="px-4 py-2 bg-ops-accent text-white rounded font-bold text-sm hover:bg-blue-600 transition-colors">
               Launch Console
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};