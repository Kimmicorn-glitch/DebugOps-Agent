import React, { useState, useRef, useEffect } from 'react';
import { AppError, ErrorStatus } from '../types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (error: Omit<AppError, 'id' | 'timestamp' | 'status'>) => void;
}

type InputTab = 'text' | 'file' | 'url' | 'voice';

// Simplified interface for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // File State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Voice Recognition Ref
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setFileName(null);
      setIsListening(false);
      setActiveTab('text');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) setTitle(`Analysis: ${file.name}`);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          // @ts-ignore - Speech API structure is complex
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            // @ts-ignore
            if (event.results[i].isFinal) {
              // @ts-ignore
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
             setContent(prev => prev + (prev ? ' ' : '') + finalTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } else {
        alert("Voice input is not supported in this browser.");
      }
    }
  };

  const handleSubmit = () => {
    if (!title || !content) return;

    let sourceFile = 'manual_input';
    if (activeTab === 'file') sourceFile = fileName || 'upload.txt';
    if (activeTab === 'url') sourceFile = 'external_url';
    if (activeTab === 'voice') sourceFile = 'voice_transcript';

    onSubmit({
      message: title,
      stackTrace: content,
      sourceFile: sourceFile
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-ops-panel border border-ops-border rounded-xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-ops-border">
          <div>
            <h2 className="text-xl font-bold text-ops-text-main">New Incident Report</h2>
            <p className="text-xs text-ops-text-muted mt-1">Submit data for agent analysis</p>
          </div>
          <button onClick={onClose} className="text-ops-text-muted hover:text-ops-text-main transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ops-border bg-ops-bg/30">
          {[
            { id: 'text', label: 'Text / Code', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'file', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
            { id: 'url', label: 'URL', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
            { id: 'voice', label: 'Voice', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as InputTab)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-2 transition-all border-b-2
                ${activeTab === tab.id 
                  ? 'text-ops-accent border-ops-accent bg-ops-panel' 
                  : 'text-ops-text-muted border-transparent hover:text-ops-text-main hover:bg-ops-panel/50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 flex-grow overflow-y-auto">
          
          {/* Common Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-ops-text-muted uppercase">Title / Summary</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Database connection timeout or CSV Data Cleanup"
              className="w-full bg-ops-bg border border-ops-border rounded p-3 text-ops-text-main focus:border-ops-accent outline-none text-sm transition-colors"
            />
          </div>

          {/* Conditional Inputs */}
          <div className="space-y-1 flex-grow flex flex-col">
            <label className="text-xs font-mono font-bold text-ops-text-muted uppercase">
              {activeTab === 'url' ? 'Target URL' : 'Content / Context'}
            </label>
            
            {activeTab === 'text' && (
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste error logs, stack traces, or code snippets here..."
                className="w-full h-48 flex-grow bg-ops-bg border border-ops-border rounded p-3 text-emerald-400 font-mono text-xs focus:border-ops-accent outline-none resize-none transition-colors"
              />
            )}

            {activeTab === 'url' && (
              <div className="flex gap-2">
                 <div className="relative flex-grow">
                   <span className="absolute left-3 top-3 text-ops-text-muted font-mono text-sm">https://</span>
                   <input 
                     type="text"
                     value={content.replace(/^https?:\/\//, '')}
                     onChange={(e) => setContent(`https://${e.target.value.replace(/^https?:\/\//, '')}`)}
                     placeholder="example.com/api/docs"
                     className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-16 text-blue-400 font-mono text-sm focus:border-ops-accent outline-none transition-colors"
                   />
                 </div>
              </div>
            )}

            {activeTab === 'file' && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-ops-border rounded-lg bg-ops-bg/30 hover:bg-ops-bg/50 hover:border-ops-accent transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".txt,.csv,.json,.log,.js,.ts" 
                  className="hidden" 
                />
                <div className="w-12 h-12 rounded-full bg-ops-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-ops-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-ops-text-main">
                    {fileName ? fileName : 'Click to Upload File'}
                  </p>
                  <p className="text-xs text-ops-text-muted mt-1">Supported: .txt, .csv, .json, .log</p>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="flex flex-col items-center justify-center h-48 gap-4 bg-ops-bg/30 rounded border border-ops-border">
                <button 
                  onClick={toggleVoice}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-ops-panel hover:bg-ops-accent'}`}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <p className={`text-sm font-mono ${isListening ? 'text-rose-400' : 'text-ops-text-muted'}`}>
                  {isListening ? 'Listening... Speak now' : 'Click microphone to record'}
                </p>
                {content && (
                  <div className="w-full px-6 text-center">
                    <p className="text-xs text-emerald-400 font-mono line-clamp-2">"{content}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-ops-border flex justify-end gap-3 bg-ops-panel/50 rounded-b-xl">
           <button 
             onClick={onClose}
             className="px-6 py-2 text-sm font-bold text-ops-text-muted hover:text-ops-text-main transition-colors"
           >
             CANCEL
           </button>
           <button 
             onClick={handleSubmit}
             disabled={!title || !content}
             className={`px-6 py-2 text-sm font-bold text-white rounded bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
           >
             SUBMIT INCIDENT
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
           </button>
        </div>

      </div>
    </div>
  );
};