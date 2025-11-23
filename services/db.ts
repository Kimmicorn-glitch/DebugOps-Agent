import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  setDoc
} from "firebase/firestore";
import { getApps } from "firebase/app";
import { AppError, AgentLog, PatchSolution, ErrorStatus } from "../types";

// Helper to check if we are in Production Mode (Real Firebase) or Demo Mode (Mock)
const isFirebaseActive = () => getApps().length > 0;

// IN-MEMORY STORE (Used for Demo Mode & Local Cache)
let errorsStore: AppError[] = [];
let logsStore: AgentLog[] = [];
let patchesStore: Record<string, PatchSolution> = {};
let listeners: Function[] = [];

const notify = () => {
  listeners.forEach(l => l());
};

// --- DATA ACCESS METHODS ---

export const subscribeToData = (callback: () => void) => {
  listeners.push(callback);

  if (isFirebaseActive()) {
    const db = getFirestore();
    
    // 1. Sync Errors
    const unsubErrors = onSnapshot(
      query(collection(db, "errors"), orderBy("timestamp", "desc")), 
      (snap) => {
        errorsStore = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
          } as AppError;
        });
        notify();
      }
    );

    // 2. Sync Logs
    const unsubLogs = onSnapshot(
      query(collection(db, "agent_logs"), orderBy("timestamp", "asc")), 
      (snap) => {
        logsStore = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
          } as AgentLog;
        });
        notify();
      }
    );

    // 3. Sync Patches
    const unsubPatches = onSnapshot(
      collection(db, "patches"), 
      (snap) => {
        const newPatches: Record<string, PatchSolution> = {};
        snap.forEach(doc => {
          const data = doc.data();
          if (data.errorId) {
            newPatches[data.errorId] = data as PatchSolution;
          }
        });
        patchesStore = newPatches;
        notify();
      }
    );

    return () => {
      listeners = listeners.filter(l => l !== callback);
      // Only unsubscribe from Firestore if no listeners left? 
      // For simplicity in this app, we keep the listeners active or assume single dashboard instance.
      // Ideally we would track unsubs.
    };
  }

  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const getErrors = () => [...errorsStore]; // Already sorted by subscription or insertion
export const getLogs = (errorId: string) => logsStore.filter(l => l.errorId === errorId);
export const getPatch = (errorId: string) => patchesStore[errorId];

// --- MUTATION METHODS ---

export const addError = async (error: Omit<AppError, 'id' | 'timestamp' | 'status'>): Promise<AppError> => {
  const newErrorData = {
    ...error,
    timestamp: Date.now(),
    status: ErrorStatus.OPEN
  };

  if (isFirebaseActive()) {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "errors"), {
      ...newErrorData,
      timestamp: Timestamp.fromMillis(newErrorData.timestamp)
    });
    return { ...newErrorData, id: docRef.id };
  } else {
    // Mock Mode
    const newError: AppError = {
      ...newErrorData,
      id: Math.random().toString(36).substr(2, 9)
    };
    errorsStore.unshift(newError);
    // Sort just in case
    errorsStore.sort((a, b) => b.timestamp - a.timestamp);
    notify();
    return newError;
  }
};

export const updateErrorStatus = async (id: string, status: ErrorStatus) => {
  if (isFirebaseActive()) {
    const db = getFirestore();
    const docRef = doc(db, "errors", id);
    await updateDoc(docRef, { status });
  } else {
    const err = errorsStore.find(e => e.id === id);
    if (err) {
      err.status = status;
      notify();
    }
  }
};

export const addLog = async (log: Omit<AgentLog, 'id' | 'timestamp'>) => {
  const newLogData = {
    ...log,
    timestamp: Date.now()
  };

  if (isFirebaseActive()) {
    const db = getFirestore();
    await addDoc(collection(db, "agent_logs"), {
      ...newLogData,
      timestamp: Timestamp.fromMillis(newLogData.timestamp)
    });
  } else {
    const newLog: AgentLog = {
      ...newLogData,
      id: Math.random().toString(36).substr(2, 9)
    };
    logsStore.push(newLog);
    notify();
  }
};

export const savePatch = async (errorId: string, patch: PatchSolution) => {
  if (isFirebaseActive()) {
    const db = getFirestore();
    // We add to patches collection, ensuring we link it to the error
    await addDoc(collection(db, "patches"), {
      errorId,
      ...patch,
      createdAt: Timestamp.now()
    });
    // Also update status
    await updateErrorStatus(errorId, ErrorStatus.PATCH_PROPOSED);
  } else {
    patchesStore[errorId] = patch;
    updateErrorStatus(errorId, ErrorStatus.PATCH_PROPOSED);
  }
};