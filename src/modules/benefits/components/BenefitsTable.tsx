import { Shield, TrendingUp, Map, Pencil, Trash2, Plane } from 'lucide-react';
import { type Benefit } from '../hooks/useBenefitsMatrix';
import { useAuthStore } from '@/modules/auth/store/auth.store';

interface BenefitsTableProps {
    data: Benefit[];
    categoryLabel: string;
    onEdit: (benefit: Benefit) => void;
    onDelete: (id: string) => void;
}

export const BenefitsTable = ({ data, categoryLabel, onEdit, onDelete }: BenefitsTableProps) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const formatLimit = (benefit: Benefit) => {
        const val = benefit.limit_value || 0;

        if (benefit.benefit_type === 'distance_cap') {
            return <span className="font-black text-lg text-slate-700 dark:text-white">{val} KM</span>;
        }

        if (benefit.currency) {
            return (
                <div className="text-right">
                    <span className={`font-black text-lg ${benefit.currency === 'USD' ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-white'}`}>
                        {val.toLocaleString('es-CR', { style: 'currency', currency: benefit.currency })}
                    </span>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Monto Máximo</div>
                </div>
            );
        }
        return val;
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg"><Shield size={20} /></div>
                    <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">{categoryLabel}</h3>
                        <p className="text-[10px] text-slate-400">Coberturas configuradas</p>
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {data.length} PLANES
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/3">Socio (Aseguradora)</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/3">Nombre del Plan</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/6">Tipo Cobertura</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-right w-1/6">Límite</th>
                            <th className="p-4 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic text-sm">No hay beneficios configurados.</td></tr>
                        ) : (
                            data.map((benefit) => (
                                <tr key={benefit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-slate-700 dark:text-white leading-tight text-sm">{benefit.partner_name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-1 opacity-50">ID: {benefit.partner_id}</div>
                                    </td>

                                    <td className="p-4 align-top">
                                        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{benefit.plan_name}</div>
                                        {benefit.service_category === 'airport' && (
                                            <div className="mt-1 flex items-center gap-2">
                                                {benefit.apply_airport_fee !== false ? (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/30 border border-sky-200"><Plane size={10} /> CON FEE (1.34x)</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200"><Plane size={10} /> TARIFA PLANA</span>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4 align-top">
                                        {benefit.benefit_type === 'monetary_cap' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-bold uppercase"><TrendingUp size={12} /> MONTO MÁX</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase"><Map size={12} /> DISTANCIA</span>
                                        )}
                                    </td>

                                    <td className="p-4 align-top text-right">
                                        {formatLimit(benefit)}
                                    </td>

                                    <td className="p-4 align-top flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => onEdit(benefit)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                                                <button onClick={() => onDelete(benefit.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};