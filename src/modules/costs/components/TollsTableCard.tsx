import { Map, Pencil, Save, X } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useState } from 'react';

interface Toll {
    id: string;
    name: string;
    prices: {
        light: number;
        microbus: number;
        tow: number;
        heavy: number;
    };
}

interface TollsTableCardProps {
    title: string;
    tolls: Toll[];
    onSave: (id: string, newPrices: any) => void;
}

export const TollsTableCard = ({ title, tolls, onSave }: TollsTableCardProps) => {
    const { user } = useAuthStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrices, setEditPrices] = useState<any>(null);

    const isAdmin = user?.role === 'admin';

    const startEdit = (toll: Toll) => {
        setEditingId(toll.id);
        setEditPrices(toll.prices);
    };

    const currencyOptions = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg"><Map size={20} /></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">{title}</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase">Peaje</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">Liviano</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">Microbús</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">Grúa</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">Pesado</th>
                            <th className="p-4 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tolls.map((toll) => (
                            <tr key={toll.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-slate-700 dark:text-slate-200 text-sm">{toll.name}</td>

                                {['light', 'microbus', 'tow', 'heavy'].map((cat) => (
                                    <td key={cat} className="p-4 text-center">
                                        {editingId === toll.id ? (
                                            <input
                                                type="number"
                                                className="w-20 bg-white dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 text-xs text-center outline-none"
                                                value={editPrices[cat]}
                                                onChange={(e) => setEditPrices({ ...editPrices, [cat]: Number(e.target.value) })}
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                ₡{toll.prices[cat as keyof Toll['prices']].toLocaleString('es-CR', currencyOptions)}
                                            </span>
                                        )}
                                    </td>
                                ))}

                                <td className="p-4 text-right">
                                    {isAdmin && (
                                        <div className="flex gap-2 justify-end">
                                            {editingId === toll.id ? (
                                                <>
                                                    <button onClick={() => { onSave(toll.id, editPrices); setEditingId(null); }} className="text-green-500 hover:bg-green-50 p-1.5 rounded-lg"><Save size={16} /></button>
                                                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg"><X size={16} /></button>
                                                </>
                                            ) : (
                                                <button onClick={() => startEdit(toll)} className="text-slate-300 hover:text-blue-500 p-1.5 rounded-lg transition-colors"><Pencil size={16} /></button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};