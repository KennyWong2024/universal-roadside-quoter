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
        if (benefit.benefit_type === 'distance_cap') {
            return <span className="font-bold text-slate-700 dark:text-slate-200">{benefit.limit_value} KM</span>;
        }
        if (benefit.currency) {
            return (
                <span className={`font-bold ${benefit.currency === 'USD' ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {benefit.limit_value.toLocaleString('es-CR', { style: 'currency', currency: benefit.currency })}
                </span>
            );
        }
        return benefit.limit_value;
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
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700 dark:text-white">{benefit.partner_name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">ID: {benefit.partner_id}</div>
                                    </td>

                                    <td className="p-4">
                                        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{benefit.plan_name}</div>

                                        {benefit.service_category === 'airport' && (
                                            <div className="mt-1 flex items-center gap-2">
                                                {benefit.apply_airport_fee !== false ? (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                                        <Plane size={10} /> CON FEE (1.34x)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        <Plane size={10} /> TARIFA PLANA
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        {benefit.benefit_type === 'monetary_cap' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                                                <TrendingUp size={12} /> MONTO MÁX
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                                                <Map size={12} /> DISTANCIA
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-4 text-right">{formatLimit(benefit)}</td>

                                    <td className="p-4 flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => onEdit(benefit)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => onDelete(benefit.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                    <Trash2 size={14} />
                                                </button>
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