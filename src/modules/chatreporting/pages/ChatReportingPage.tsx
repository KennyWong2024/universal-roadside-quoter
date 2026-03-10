import { useState } from 'react';
import { MessageSquareText, History, Wrench } from 'lucide-react';
// 👇 1. Descomentamos la importación 👇
import { MessageGenerator } from '../components/generator/MessageGenerator';

type TabType = 'generator' | 'history';

export const ChatReportingPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('generator');

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* CABECERA Y NAVEGACIÓN */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                        <MessageSquareText size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reportes CRM / WhatsApp</h2>
                        <p className="text-sm text-slate-500">Generador de notas estructuradas para socios</p>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-xl backdrop-blur-md border border-slate-300 dark:border-slate-700/50">
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'generator'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        <MessageSquareText size={18} />
                        <span className="hidden sm:inline">Generador</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        <History size={18} />
                        <span className="hidden sm:inline">Historial</span>
                    </button>
                </div>
            </div>

            {/* ÁREA DE CONTENIDO */}
            <div className="relative">
                {/* 1. EL GENERADOR */}
                <div className={activeTab === 'generator' ? 'block' : 'hidden'}>
                    {/* 👇 2. Renderizamos el orquestador real aquí 👇 */}
                    <MessageGenerator />
                </div>

                {/* 2. EL HISTORIAL (EN DESARROLLO) */}
                <div className={activeTab === 'history' ? 'block animate-in fade-in zoom-in-95' : 'hidden'}>
                    <div className="min-h-[400px] bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Wrench size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Historial en Desarrollo</h3>
                        <p className="text-slate-500 max-w-md">
                            Esta sección contendrá integraciones avanzadas y un registro histórico de las notas generadas. Próximamente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};