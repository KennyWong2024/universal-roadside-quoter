import { Copy, Check, FileText } from 'lucide-react';
import { useState } from 'react';
import { type TaxiCalculation } from '../../engine/useTaxiQuote';

interface TaxiNotePreviewProps {
    partnerName: string;
    planName: string;
    vehicleType: 'light' | 'microbus';
    calculation: TaxiCalculation | null;
}

export const TaxiNotePreview = ({ partnerName, planName, vehicleType, calculation }: TaxiNotePreviewProps) => {
    const [copied, setCopied] = useState(false);

    if (!calculation) return null;

    const format = (n: number) => `₡${n.toLocaleString('es-CR', { maximumFractionDigits: 0 })}`;
    const autoLabel = vehicleType === 'light' ? 'AUTOMOVIL' : 'BUSETA';

    const clipboardText = `
${partnerName.toUpperCase()} (${planName.toUpperCase()}), PS: ${calculation.ps}, SD: ${calculation.sd}, TIPO DE AUTO: ${autoLabel},
COSTO (2 PUNTOS - TARIFA SUGERIDA): ${format(calculation.cost2Points)},
COSTO (3 PUNTOS - TARIFA SUGERIDA): ${format(calculation.cost3Points)}, BENEFICIO: ${format(calculation.benefitApplied)}, EXCEDENTE: ${format(calculation.excedentNet)}
`.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(clipboardText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasExcedente = calculation.excedentNet > 0;

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl opacity-10 group-hover:opacity-30 transition duration-500 blur"></div>
            <div className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-500">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400">
                        <FileText size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Nota CRM</h4>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
              ${copied ? 'bg-green-500/10 border-green-500/50 text-green-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}
            `}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIADO' : 'COPIAR'}
                    </button>
                </div>

                <div className="space-y-2 font-mono text-xs leading-relaxed">
                    <p className="text-slate-500 dark:text-slate-400">
                        SOCIO: <span className="text-slate-900 dark:text-white font-bold">{partnerName || '...'}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                        PLAN: <span className="text-fuchsia-600 dark:text-fuchsia-400 font-medium">{planName || '...'}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                        VEHÍCULO: <span className="text-slate-900 dark:text-white font-bold">{autoLabel}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Distancia Total</span>
                            <span className="text-slate-900 dark:text-white font-bold">{calculation.ps + calculation.sd} KM</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Costo Proveedor</span>
                            <span className="text-slate-900 dark:text-white font-bold">{format(calculation.cost3Points)}</span>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>COBERTURA:</span>
                        <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold">
                            {format(calculation.benefitApplied)}
                        </span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">TOTAL CLIENTE:</span>
                        <span className={`text-xl font-black ${hasExcedente ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {format(calculation.grandTotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};