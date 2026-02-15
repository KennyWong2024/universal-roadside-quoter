import { useState } from 'react';
import { Pencil, Save, X, Truck, Car } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';

interface TariffCardProps {
    title: string;
    type: 'towing' | 'heavy' | 'taxi';
    data: any;
    onSave: (id: string, newData: any) => void;
}

export const TariffCard = ({ title, type, data, onSave }: TariffCardProps) => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(data);

    const isAdmin = user?.role === 'admin';

    const icons = {
        towing: <Truck className="text-blue-500" />,
        heavy: <Truck className="text-purple-500" size={28} />,
        taxi: <Car className="text-yellow-500" />
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {icons[type]}
                </div>
                {isAdmin && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                        <Pencil size={16} />
                    </button>
                )}
            </div>

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h4>

            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Base (10 KM)</span>
                    {isEditing ? (
                        <input
                            type="number"
                            className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded p-1 text-sm outline-none"
                            value={editData.tiers.base.cost}
                            onChange={(e) => setEditData({
                                ...editData,
                                tiers: { ...editData.tiers, base: { ...editData.tiers.base, cost: Number(e.target.value) } }
                            })}
                        />
                    ) : (
                        <span className="text-xl font-black text-slate-800 dark:text-white">
                            ₡{data.tiers.base.cost.toLocaleString('es-CR')}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">KM Extra</span>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.01"
                            className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded p-1 text-sm outline-none"
                            value={editData.tiers.extra.cost_per_km}
                            onChange={(e) => setEditData({
                                ...editData,
                                tiers: { ...editData.tiers, extra: { cost_per_km: Number(e.target.value) } }
                            })}
                        />
                    ) : (
                        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                            ₡{data.tiers.extra.cost_per_km.toLocaleString('es-CR')}
                        </span>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => { onSave(data.id, editData); setIsEditing(false); }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                    >
                        <Save size={14} /> GUARDAR
                    </button>
                    <button
                        onClick={() => { setIsEditing(false); setEditData(data); }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};