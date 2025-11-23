import { AppError, AgentLog, PatchSolution, ErrorStatus } from "../types";

// In a real deployment, this would use import { initializeApp } from "firebase/app";
// and import { getFirestore } from "firebase/firestore";

// MOCK STORE for Session
let errorsStore: AppError[] = [];
let logsStore: AgentLog[] = [];
let patchesStore: Record<string, PatchSolution> = {};
let listeners: Function[] = [];

const notify = () => {
  listeners.forEach(l => l());
};

export const subscribeToData = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const getErrors = () => [...errorsStore].sort((a, b) => b.timestamp - a.timestamp);
export const getLogs = (errorId: string) => logsStore.filter(l => l.errorId === errorId).sort((a, b) => a.timestamp - b.timestamp);
export const getPatch = (errorId: string) => patchesStore[errorId];

export const addError = (error: Omit<AppError, 'id' | 'timestamp' | 'status'>) => {
  const newError: AppError = {
    ...error,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    status: ErrorStatus.OPEN
  };
  errorsStore.unshift(newError);
  notify();
  return newError;
};

export const updateErrorStatus = (id: string, status: ErrorStatus) => {
  const err = errorsStore.find(e => e.id === id);
  if (err) {
    err.status = status;
    notify();
  }
};

export const addLog = (log: Omit<AgentLog, 'id' | 'timestamp'>) => {
  const newLog: AgentLog = {
    ...log,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  logsStore.push(newLog);
  notify();
};

export const savePatch = (errorId: string, patch: PatchSolution) => {
  patchesStore[errorId] = patch;
  updateErrorStatus(errorId, ErrorStatus.PATCH_PROPOSED);
};
