import { Copy, Check, FileText } from 'lucide-react';
import { useState } from 'react';

interface NotePreviewProps {
    partnerName: string;
    planName: string;
    ps: string;
    sd: string;
    maneuver: string;
    totalKm: number;
    tollsList: string[];
    calculatedAmount: number;
}

export const NotePreview = ({
    partnerName,
    planName,
    ps,
    sd,
    maneuver,
    totalKm,
    tollsList,
    calculatedAmount
}: NotePreviewProps) => {
    const [copied, setCopied] = useState(false);

    const formattedTotal = calculatedAmount.toLocaleString('es-CR', {
        style: 'currency',
        currency: 'CRC'
    });

    const clipboardText = `
SOCIO: ${partnerName}
PLAN: ${planName}
RECORRIDO: ${totalKm} KM (PS: ${ps || 0} | SD: ${sd || 0})
MANIOBRA: ₡${Number(maneuver).toLocaleString('es-CR')}
PEAJES (${tollsList.length}): ${tollsList.length > 0 ? tollsList.join(', ') : 'NINGUNO'}
TOTAL CLIENTE: ${formattedTotal}
`.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(clipboardText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10 group-hover:opacity-30 transition duration-500 blur"></div>

            <div className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-500">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <FileText size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Nota CRM</h4>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
              ${copied
                                ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}
            `}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIADO' : 'COPIAR'}
                    </button>
                </div>

                <div className="space-y-2 font-mono text-xs leading-relaxed">
                    <p className="text-slate-500 dark:text-slate-400">SOCIO: <span className="text-slate-900 dark:text-white font-bold">{partnerName || '...'}</span></p>
                    <p className="text-slate-500 dark:text-slate-400">PLAN: <span className="text-blue-600 dark:text-blue-300">{planName}</span></p>

                    <div className="grid grid-cols-2 gap-4 my-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Distancia</span>
                            <span className="text-slate-900 dark:text-white font-bold">{totalKm} KM</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Maniobra</span>
                            <span className="text-slate-900 dark:text-white font-bold">₡{Number(maneuver).toLocaleString('es-CR')}</span>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400">
                        PEAJES: <span className="text-orange-600 dark:text-orange-300 font-bold">{tollsList.length > 0 ? `${tollsList.length} Seleccionados` : 'Ninguno'}</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">TOTAL CLIENTE:</span>
                        <span className={`text-xl font-black ${calculatedAmount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {formattedTotal}
                        </span>
                    </div>

                    {tollsList.length > 0 && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate italic mt-1">
                            ({tollsList.join(', ')})
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};