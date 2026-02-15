import type { ReactNode } from 'react';

interface CostMatrixLayoutProps {
    children: ReactNode;
}

export const CostMatrixLayout = ({ children }: CostMatrixLayoutProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
        </div>
    );
};