import { useState, useEffect } from 'react';
import { Pencil, Save, X, Truck, DollarSign, Route } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { type ServiceTariff } from '@/shared/types/costs.types';

interface TowingConfigCardProps {
    title: string;
    type: 'towing' | 'heavy';
    data: ServiceTariff;
    onSave: (id: string, newData: any) => void;
}

export const TowingConfigCard = ({ title, type, data, onSave }: TowingConfigCardProps) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        base_cost: 0,
        extra_km: 0,
        fixed_fee: 0
    });

    const format = (n: number) => `₡${n.toLocaleString('es-CR')}`;
    const iconColor = type === 'towing' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';

    useEffect(() => {
        if (data) {
            setEditData({
                base_cost: data.tiers?.base?.cost || 0,
                extra_km: data.tiers?.extra?.cost_per_km || 0,
                fixed_fee: data.fixed_fee_amount || 0
            });
        }
    }, [data, isEditing]);

    const handleSave = () => {
        const payload = {
            fixed_fee_amount: Number(editData.fixed_fee),
            tiers: {
                base: {
                    ...data.tiers?.base,
                    cost: Number(editData.base_cost)
                },
                extra: {
                    ...data.tiers?.extra,
                    cost_per_km: Number(editData.extra_km)
                }
            }
        };
        onSave(data.id, payload);
        setIsEditing(false);
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all ${isEditing ? 'border-blue-500 shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:shadow-md'}`}>
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconColor}`}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wide">{title}</h3>
                        <p className="text-xs text-slate-500">Configuración de montos y fees</p>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={18} /></button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                    <Save size={14} /> GUARDAR
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="grid grid-cols-1 gap-4">
                {/* Costo Base */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Truck size={16} className="text-slate-400" />
                        <span>Costo Base (Primeros 10 KM)</span>
                    </div>
                    {isEditing ? (
                        <input type="number" className="w-28 text-right p-1.5 border border-blue-400 rounded-lg outline-none" value={editData.base_cost} onChange={e => setEditData({ ...editData, base_cost: Number(e.target.value) })} />
                    ) : (
                        <span className="text-lg font-black text-slate-800 dark:text-white">{format(editData.base_cost)}</span>
                    )}
                </div>

                {/* KM Extra */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Route size={16} className="text-slate-400" />
                        <span>Costo por KM Adicional</span>
                    </div>
                    {isEditing ? (
                        <input type="number" className="w-28 text-right p-1.5 border border-blue-400 rounded-lg outline-none" value={editData.extra_km} onChange={e => setEditData({ ...editData, extra_km: Number(e.target.value) })} />
                    ) : (
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{format(editData.extra_km)}</span>
                    )}
                </div>

                {/* Fee Administrativo */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <DollarSign size={16} className="text-slate-400" />
                        <span>Fee Administrativo (Fijo)</span>
                    </div>
                    {isEditing ? (
                        <input type="number" className="w-28 text-right p-1.5 border border-blue-400 rounded-lg outline-none" value={editData.fixed_fee} onChange={e => setEditData({ ...editData, fixed_fee: Number(e.target.value) })} />
                    ) : (
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{format(editData.fixed_fee)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};