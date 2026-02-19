import { create } from 'zustand';

export interface LogEntry {
    id: string;
    timestamp: Date;
    type: 'read' | 'write' | 'cache' | 'api' | 'error';
    source: string;
    message: string;
    value?: number;
}

interface DevMonitorState {
    metrics: {
        firestoreReads: number;
        firestoreWrites: number;
        cacheHits: number;
        apiCalls: number;
    };
    logs: LogEntry[];
    trackRead: (source: string, count?: number) => void;
    trackWrite: (source: string, count?: number) => void;
    trackCache: (source: string) => void;
    trackApi: (source: string) => void;
    logError: (source: string, error: any) => void;
    resetMetrics: () => void;
}

export const useDevMonitorStore = create<DevMonitorState>((set) => ({
    metrics: { firestoreReads: 0, firestoreWrites: 0, cacheHits: 0, apiCalls: 0 },
    logs: [],

    trackRead: (source: string, count = 1) => set((state) => {
        const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), type: 'read', source, message: `Lectura(s): ${count}`, value: count };
        return { metrics: { ...state.metrics, firestoreReads: state.metrics.firestoreReads + count }, logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    trackWrite: (source: string, count = 1) => set((state) => {
        const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), type: 'write', source, message: `Escritura(s) / Modificación: ${count}`, value: count };
        return { metrics: { ...state.metrics, firestoreWrites: state.metrics.firestoreWrites + count }, logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    trackCache: (source: string) => set((state) => {
        const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), type: 'cache', source, message: `Dato desde RAM (Ahorro)` };
        return { metrics: { ...state.metrics, cacheHits: state.metrics.cacheHits + 1 }, logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    trackApi: (source: string) => set((state) => {
        const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), type: 'api', source, message: `Llamada a API externa` };
        return { metrics: { ...state.metrics, apiCalls: state.metrics.apiCalls + 1 }, logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    logError: (source: string, error: any) => set((state) => {
        const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), type: 'error', source, message: `ERROR: ${error?.message || 'Desconocido'}` };
        return { logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    resetMetrics: () => set({ metrics: { firestoreReads: 0, firestoreWrites: 0, cacheHits: 0, apiCalls: 0 }, logs: [] })
}));