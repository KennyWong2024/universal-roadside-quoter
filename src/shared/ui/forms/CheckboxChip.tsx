import type { ReactNode } from 'react';

interface CheckboxChipProps {
    label: string;
    isActive: boolean;
    onToggle: () => void;
    icon?: ReactNode;
}

export const CheckboxChip = ({ label, isActive, onToggle, icon }: CheckboxChipProps) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`
        flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 select-none
        ${isActive
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                    : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500'}
      `}
        >
            <div className={`
        w-4 h-4 rounded-md border flex items-center justify-center transition-colors
        ${isActive ? 'bg-white border-white' : 'border-slate-300 dark:border-slate-600'}
      `}>
                {isActive && (
                    <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {icon && <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>}

            <span className="text-sm font-bold tracking-tight">
                {label}
            </span>
        </button>
    );
};