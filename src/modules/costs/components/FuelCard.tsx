import { useState } from 'react';
import { Fuel, Pencil, Save, X } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';

interface FuelCardProps {
    data: {
        prices: {
            super: number;
            regular: number;
            diesel: number;
        };
        currency: string;
    };
    onSave: (newData: any) => void;
}

export const FuelCard = ({ data, onSave }: FuelCardProps) => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editPrices, setEditPrices] = useState(data.prices);

    const isAdmin = user?.role === 'admin';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative group h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                    <Fuel size={24} />
                </div>
                {isAdmin && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 rounded-lg">
                        <Pencil size={16} />
                    </button>
                )}
            </div>

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Combustibles</h4>

            <div className="space-y-3">
                {Object.entries(editPrices).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-1 last:border-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{key}</span>
                        {isEditing ? (
                            <input
                                type="number"
                                step="0.01"
                                className="w-20 bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded px-2 py-0.5 text-xs text-right outline-none"
                                value={value}
                                onChange={(e) => setEditPrices({ ...editPrices, [key]: Number(e.target.value) })}
                            />
                        ) : (
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                                ₡{value.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => { onSave(editPrices); setIsEditing(false); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        <Save size={14} /> GUARDAR
                    </button>
                    <button onClick={() => { setIsEditing(false); setEditPrices(data.prices); }} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};