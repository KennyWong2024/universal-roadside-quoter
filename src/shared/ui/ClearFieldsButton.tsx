import { RotateCcw } from 'lucide-react';

interface ClearFieldsButtonProps {
    onClear: () => void;
    label?: string;
    className?: string;
}

export const ClearFieldsButton = ({
    onClear,
    label = "LIMPIAR CAMPOS",
    className = ""
}: ClearFieldsButtonProps) => {
    return (
        <button
            onClick={onClear}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 ${className}`}
        >
            <RotateCcw size={14} />
            {label}
        </button>
    );
};