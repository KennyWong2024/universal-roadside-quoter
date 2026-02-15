import type { InputHTMLAttributes } from 'react';

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    suffix?: string;
}

export const LabeledInput = ({ label, suffix, className = '', ...props }: LabeledInputProps) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                {label}
            </label>
            <div className="relative group">
                <input
                    {...props}
                    className={`
            w-full bg-white/50 dark:bg-slate-800/50 
            border border-slate-200 dark:border-slate-700
            rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none
            transition-all duration-200
            ${suffix ? 'pr-12' : ''}
            ${className}
          `}
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
};