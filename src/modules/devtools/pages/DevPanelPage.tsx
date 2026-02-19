import { Navigate } from 'react-router-dom';
import { Database, Zap, Globe, Trash2, Terminal, ShieldAlert, Activity } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useDevMonitorStore } from '../store/useDevMonitorStore';

export const DevPanelPage = () => {
    const { user } = useAuthStore();
    const { metrics, logs, resetMetrics } = useDevMonitorStore();

    if (!user?.is_dev) {
        return <Navigate to="/cotizador" replace />;
    }

    const getLogColor = (type: string) => {
        switch (type) {
            case 'read': return 'text-orange-500 dark:text-orange-400 bg-orange-500/10';
            case 'cache': return 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10';
            case 'api': return 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10';
            case 'error': return 'text-red-500 dark:text-red-400 bg-red-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 dark:bg-slate-800 rounded-xl text-emerald-400 shadow-lg border border-slate-700">
                        <Activity size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">DevTools Monitor</h2>
                        <p className="text-sm text-slate-500">Telemetría de rendimiento y consumo en RAM</p>
                    </div>
                </div>

                <button
                    onClick={resetMetrics}
                    className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-5 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors active:scale-95"
                >
                    <Trash2 size={18} /> LIMPIAR SESIÓN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-orange-200 dark:border-orange-500/30 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lecturas Firebase</p>
                            <h3 className="text-5xl font-black text-slate-800 dark:text-white mt-2 font-mono">
                                {metrics.firestoreReads}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                            <Database size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-4 font-medium relative z-10">
                        Costo operativo en tiempo real
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-500/30 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Impactos en RAM</p>
                            <h3 className="text-5xl font-black text-slate-800 dark:text-white mt-2 font-mono">
                                {metrics.cacheHits}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <Zap size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-4 font-medium relative z-10 flex items-center gap-1">
                        Consultas salvadas por los Guardianes
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-cyan-200 dark:border-cyan-500/30 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Llamadas API</p>
                            <h3 className="text-5xl font-black text-slate-800 dark:text-white mt-2 font-mono">
                                {metrics.apiCalls}
                            </h3>
                        </div>
                        <div className="p-3 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
                            <Globe size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-4 font-medium relative z-10">
                        Consumo de servicios externos
                    </p>
                </div>
            </div>
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950/50">
                    <Terminal size={18} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Consola de Eventos</h3>

                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                </div>

                <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs sm:text-sm space-y-2">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                            <ShieldAlert size={48} className="mb-4 opacity-20" />
                            <p>No hay eventos registrados en esta sesión.</p>
                            <p className="text-xs mt-2 opacity-50">Navega por la app para capturar métricas.</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 rounded-lg hover:bg-slate-800/50 transition-colors border-l-2 border-transparent hover:border-slate-600">
                                <span className="text-slate-500 whitespace-nowrap">
                                    {log.timestamp.toLocaleTimeString()}
                                </span>

                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider w-fit ${getLogColor(log.type)}`}>
                                    {log.type}
                                </span>

                                <span className="text-emerald-400 font-bold whitespace-nowrap">
                                    [{log.source}]
                                </span>

                                <span className="text-slate-300">
                                    {log.message}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};