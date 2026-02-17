import { useState } from 'react';
import { Pencil, Save, X, Plane } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';

interface AirportConfigCardProps {
    data: any;
    onSave: (id: string, newData: any) => void;
}

export const AirportConfigCard = ({ data, onSave }: AirportConfigCardProps) => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(data);

    const isAdmin = user?.role === 'admin';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative group transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-xl">
                    <Plane size={24} />
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

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Taxi Aeropuerto</h4>

            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Multiplicador Fee</span>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.01"
                            className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded p-1 text-sm outline-none font-bold text-blue-600"
                            value={editData.airport_config.fee_multiplier}
                            onChange={(e) => setEditData({
                                ...editData,
                                airport_config: { ...editData.airport_config, fee_multiplier: Number(e.target.value) }
                            })}
                        />
                    ) : (
                        <span className="text-xl font-black text-slate-800 dark:text-white">
                            x{data.airport_config?.fee_multiplier || 1.34}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Parqueo Aeropuerto</span>
                    {isEditing ? (
                        <input
                            type="number"
                            className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded p-1 text-sm outline-none font-bold text-blue-600"
                            value={editData.airport_config.parking_cost}
                            onChange={(e) => setEditData({
                                ...editData,
                                airport_config: { ...editData.airport_config, parking_cost: Number(e.target.value) }
                            })}
                        />
                    ) : (
                        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                            ₡{(data.airport_config?.parking_cost || 750).toLocaleString('es-CR')}
                        </span>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={() => { onSave(data.id, editData); setIsEditing(false); }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Save size={14} /> GUARDAR
                    </button>
                    <button
                        onClick={() => { setIsEditing(false); setEditData(data); }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};