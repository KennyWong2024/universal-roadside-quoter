import type { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
    return (
        <div className={`
      relative overflow-hidden
      bg-white/10 dark:bg-black/20 
      backdrop-blur-xl 
      border border-white/20 dark:border-white/10
      shadow-2xl
      rounded-2xl
      ${className}
    `}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
            {children}
        </div>
    );
};