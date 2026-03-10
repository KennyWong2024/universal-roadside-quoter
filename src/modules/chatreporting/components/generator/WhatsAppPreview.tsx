import { useState, useEffect } from 'react';
import { Copy, Check, Send, UserCircle2 } from 'lucide-react';

interface WhatsAppPreviewProps {
    message: string;
}

export const WhatsAppPreview = ({ message }: WhatsAppPreviewProps) => {
    const [copied, setCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }));
    }, [message]);

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWA = () => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 transition-colors duration-500">

            <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <UserCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-[#e9edef]">Chat CRM Operaciones</h4>
                        <p className="text-[10px] text-slate-500 dark:text-[#8696a0]">Vista previa del mensaje</p>
                    </div>
                </div>
            </div>

            {/* 👇 FIX DEL SCROLL: Quitamos justify-end y usamos flex-col normal 👇 */}
            <div className="flex-1 p-4 md:p-6 bg-[#efeae2] dark:bg-[#0b141a] overflow-y-auto relative custom-scrollbar flex flex-col">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* 👇 FIX: Añadimos mt-auto para empujar al fondo sin cortar el inicio 👇 */}
                <div className="mt-auto relative max-w-[90%] md:max-w-[85%] self-end animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-[#d9fdd3] dark:bg-[#005c4b] rounded-lg rounded-tr-none p-2.5 pb-6 md:p-3 md:pb-7 shadow-sm">

                        <div className="font-mono text-xs md:text-sm leading-relaxed text-[#111b21] dark:text-[#e9edef] whitespace-pre-wrap select-all">
                            {message || "Comienza a llenar el formulario para ver la nota aquí..."}
                        </div>

                        <span className="absolute bottom-1.5 right-2 md:bottom-2 md:right-3 text-[10px] text-[#667781] dark:text-[#8696a0] font-sans flex items-center gap-1">
                            {currentTime}
                            <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#53bdeb] ml-1">
                                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="absolute top-0 -right-2 w-2 h-3 bg-[#d9fdd3] dark:bg-[#005c4b]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 grid grid-cols-2 gap-3">
                <button
                    onClick={handleCopy}
                    disabled={!message}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all
                        ${copied
                            ? 'bg-emerald-500 text-white scale-95'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? '¡COPIADO!' : 'COPIAR NOTA'}
                </button>

                <button
                    onClick={handleSendWA}
                    disabled={!message}
                    className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} className="ml-1" />
                    ENVIAR WA
                </button>
            </div>
        </div>
    );
};