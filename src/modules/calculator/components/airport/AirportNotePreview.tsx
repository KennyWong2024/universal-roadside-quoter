import { Copy, Check, FileText } from 'lucide-react';
import { useState } from 'react';
import { type TaxiRate } from '@/modules/costs/hooks/useAirportRates';
import { type Benefit } from '@/shared/hooks/useBenefits';

interface AirportNotePreviewProps {
    selectedRoute: TaxiRate | null;
    selectedBenefit: Benefit | null;
    calculation: any;
    tripType: 'one_way' | 'round_trip';
    generateNote: () => string;
}

export const AirportNotePreview = ({
    selectedRoute,
    selectedBenefit,
    calculation,
    tripType,
    generateNote
}: AirportNotePreviewProps) => {

    const [copied, setCopied] = useState(false);
    const hasData = !!calculation;

    const handleCopy = () => {
        if (!hasData) return;
        navigator.clipboard.writeText(generateNote());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fmt = (n: number) => `₡${n.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const totalAmount = calculation?.grandTotal || 0;
    const isClientPaying = totalAmount > 0;

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-2xl opacity-10 group-hover:opacity-30 transition duration-500 blur"></div>

            <div className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-500">

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                        <FileText size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Nota CRM</h4>
                    </div>
                    <button
                        onClick={handleCopy}
                        disabled={!hasData}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                            ${copied
                                ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'}
                        `}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIADO' : 'COPIAR'}
                    </button>
                </div>

                <div className="space-y-2 font-mono text-xs leading-relaxed">

                    <p className="text-slate-500 dark:text-slate-400">
                        SOCIO: <span className="text-slate-900 dark:text-white font-bold">{selectedBenefit?.partner_name || '...'}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                        PLAN: <span className="text-sky-600 dark:text-sky-300 font-medium">{selectedBenefit?.plan_name || '...'}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-2 my-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Ruta</span>
                            <span className="text-slate-900 dark:text-white font-bold text-right truncate ml-4">
                                {selectedRoute ? `${selectedRoute.location.district}, ${selectedRoute.location.canton}` : '...'}
                            </span>
                        </div>

                        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Aeropuerto</span>
                            <div className="text-right">
                                <span className="text-slate-900 dark:text-white font-bold block">
                                    {selectedRoute?.airport_id || 'SJO'}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                    {tripType === 'round_trip' ? 'IDA Y VUELTA' : 'SOLO IDA'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>COBERTURA:</span>
                        <span className="text-green-600 dark:text-green-400 font-bold">
                            {hasData ? fmt(calculation.benefitApplied) : '₡0'}
                        </span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">TOTAL CLIENTE:</span>
                        <span className={`text-xl font-black ${isClientPaying ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {fmt(totalAmount)}
                        </span>
                    </div>

                    {tripType === 'round_trip' && hasData && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic mt-1">
                            (Incluye ambos trayectos)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};