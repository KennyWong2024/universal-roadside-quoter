import { CheckboxChip } from './CheckboxChip';

interface Toll {
    id: string;
    name: string;
    route?: string;
    prices: {
        tow: number;
        heavy: number;
        [key: string]: number;
    };
}

interface TollSelectorProps {
    tolls: Toll[];
    selectedTolls: string[];
    onToggle: (id: string) => void;
    type: 'tow' | 'heavy';
}

export const TollSelector = ({ tolls, selectedTolls, onToggle, type }: TollSelectorProps) => {
    const ruta27 = tolls.filter(t => t.route === 'Ruta 27');
    const otros = tolls.filter(t => t.route !== 'Ruta 27');

    return (
        <div className="space-y-6">
            {ruta27.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            Peajes Ruta 27
                        </span>
                        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {ruta27.map(toll => (
                            <CheckboxChip
                                key={toll.id}
                                label={`${toll.name} (₡${toll.prices[type] || toll.prices.tow})`}
                                isActive={selectedTolls.includes(toll.id)}
                                onToggle={() => onToggle(toll.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {otros.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            Otros Peajes
                        </span>
                        <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {otros.map(toll => (
                            <CheckboxChip
                                key={toll.id}
                                label={`${toll.name} (₡${toll.prices[type] || toll.prices.tow})`}
                                isActive={selectedTolls.includes(toll.id)}
                                onToggle={() => onToggle(toll.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};