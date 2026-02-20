import { useState } from 'react';
import { Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FloatingAirportNoteProps {
    generateNote: () => string;
    totalAmount: number;
}

export const FloatingAirportNote = ({ generateNote, totalAmount }: FloatingAirportNoteProps) => {
    const [copied, setCopied] = useState(false);

    const formattedTotal = `₡${totalAmount.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const hasExcedente = totalAmount > 0;

    const handleCopy = async () => {
        const clipboardText = generateNote();
        try {
            await navigator.clipboard.writeText(clipboardText);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = clipboardText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`p-4 rounded-2xl border ${hasExcedente ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-widest">
                    Total a Cobrar
                </p>
                <div className="flex justify-center items-center gap-2">
                    {hasExcedente && <AlertTriangle size={24} className="text-red-500" />}
                    <span className={`text-4xl font-black tracking-tight ${hasExcedente ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                        {formattedTotal}
                    </span>
                </div>
            </div>

            <button
                onClick={handleCopy}
                disabled={copied}
                className={`w-full py-5 px-6 rounded-2xl font-extrabold text-lg shadow-lg transition-all flex items-center justify-center gap-3
                    ${copied
                        ? 'bg-emerald-500 text-white scale-95'
                        : 'bg-sky-600 hover:bg-sky-700 text-white hover:shadow-xl hover:-translate-y-1 active:scale-95'}`}
            >
                {copied ? (
                    <><CheckCircle2 size={28} className="animate-bounce" /> ¡COPIADO AL PORTAPAPELES!</>
                ) : (
                    <><Copy size={28} /> COPIAR NOTA CRM</>
                )}
            </button>
        </div>
    );
};