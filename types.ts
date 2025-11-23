export enum ErrorStatus {
  OPEN = 'OPEN',
  ANALYZING = 'ANALYZING',
  PATCH_PROPOSED = 'PATCH_PROPOSED',
  RESOLVED = 'RESOLVED'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError {
  id: string;
  message: string;
  stackTrace: string;
  sourceFile: string;
  timestamp: number;
  status: ErrorStatus;
}

export interface PatchSolution {
  root_cause: string;
  severity: Severity;
  files_to_modify: string[];
  patch: string;
  explanation: string;
  next_steps: string[];
}

export interface AgentLog {
  id: string;
  errorId: string;
  step: string; // e.g., "Reading Logs", "Querying Gemini", "Generating Patch"
  description: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

export interface AgentContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}
