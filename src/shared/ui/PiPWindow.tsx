import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink } from 'lucide-react';

interface PiPWindowProps {
    children: ReactNode;
    onClose: () => void;
    title?: string;
}

export const PiPWindow = ({ children, onClose, title = "Cotizador Flotante" }: PiPWindowProps) => {
    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    useEffect(() => {
        let isMounted = true;

        const openPip = async () => {
            if (!('documentPictureInPicture' in window)) {
                alert("Tu navegador no soporta ventanas flotantes. Usa Google Chrome o Edge.");
                onClose();
                return;
            }

            try {
                const pip = await (window as any).documentPictureInPicture.requestWindow({
                    width: 450,
                    height: 750,
                });

                if (!isMounted) return;

                Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]')).forEach((node) => {
                    pip.document.head.appendChild(node.cloneNode(true));
                });

                if (document.documentElement.classList.contains('dark')) {
                    pip.document.documentElement.classList.add('dark');
                }

                pip.document.body.className = "bg-[#f0f2f5] dark:bg-[#0a0e17] overflow-hidden m-0 p-0 font-sans text-slate-900 dark:text-slate-100";
                pip.document.title = title;

                pip.addEventListener('pagehide', () => {
                    setPipWindow(null);
                    onClose();
                });

                setPipWindow(pip);
            } catch (error) {
                console.error("Error abriendo ventana flotante:", error);
                onClose();
            }
        };

        openPip();

        return () => {
            isMounted = false;
            if (pipWindow) pipWindow.close();
        };
    }, []);

    if (!pipWindow) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 animate-pulse">
                <ExternalLink size={32} className="mb-4 text-blue-500" />
                <p>Abriendo Cotizador Flotante...</p>
            </div>
        );
    }

    return createPortal(children, pipWindow.document.body);
};