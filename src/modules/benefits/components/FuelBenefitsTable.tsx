import { useState } from 'react';
import { Shield, Pencil, Trash2, Car, Gauge, MapPin, Zap, Droplets, Fuel, Copy, Check } from 'lucide-react';
import type { Benefit } from '@/shared/types/benefits.types';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useCostMatrix } from '@/modules/costs/hooks/useCostMatrix';

interface FuelBenefitsTableProps {
    data: Benefit[];
    onEdit: (benefit: Benefit) => void;
    onDelete: (id: string) => void;
}

export const FuelBenefitsTable = ({ data, onEdit, onDelete }: FuelBenefitsTableProps) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const { fuel } = useCostMatrix();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (amount: number, id: string) => {
        navigator.clipboard.writeText(Math.round(amount).toString());
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 6000);
    };

    const formatMeta = (val: string | undefined, type: 'cc' | 'vehicle' | 'zone') => {
        if (!val || val === 'all') {
            switch (type) {
                case 'cc': return 'No Aplica';
                case 'vehicle': return 'Autos / Motos';
                case 'zone': return 'Sin Restricción';
                default: return 'N/A';
            }
        }
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    const getMetaClass = (val?: string) => {
        if (!val || val === 'all') return "text-slate-400 font-medium text-xs italic";
        return "text-slate-700 dark:text-white font-bold text-xs uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700";
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg"><Shield size={20} /></div>
                    <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">Planes de Envío de Combustible</h3>
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
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-[20%]">Socio / Plan</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-[15%]">Vehículo</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-[15%]">Cilindraje</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-[15%]">Zona</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center w-[25%]">Tarjetas de Cobertura</th>
                            <th className="p-4 w-[10%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic text-sm">No hay planes de combustible configurados.</td></tr>
                        ) : (
                            data.map((benefit) => {
                                const prices = fuel?.prices || { super: 0, regular: 0, diesel: 0 };
                                const limits = benefit.fuel_limits || { super: 0, regular: 0, diesel: 0 };
                                const superMonto = limits.super * prices.super;
                                const regularMonto = limits.regular * prices.regular;
                                const dieselMonto = limits.diesel * prices.diesel;

                                return (
                                    <tr key={benefit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row">
                                        {/* SOCIO Y PLAN */}
                                        <td className="p-4 align-top">
                                            <div className="font-black text-slate-700 dark:text-white text-base">{benefit.partner_name}</div>
                                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{benefit.plan_name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-1 opacity-40 group-hover:opacity-100 transition-opacity">{benefit.partner_id}</div>
                                        </td>

                                        {/* ESPECIFICACIONES */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <Car size={14} className="text-slate-300" />
                                                <span className={getMetaClass(benefit.fuel_metadata?.vehicle_type)}>
                                                    {formatMeta(benefit.fuel_metadata?.vehicle_type, 'vehicle')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <Gauge size={14} className="text-slate-300" />
                                                <span className={getMetaClass(benefit.fuel_metadata?.cc_range)}>
                                                    {formatMeta(benefit.fuel_metadata?.cc_range, 'cc')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-300" />
                                                <span className={getMetaClass(benefit.fuel_metadata?.zone)}>
                                                    {formatMeta(benefit.fuel_metadata?.zone, 'zone')}
                                                </span>
                                            </div>
                                        </td>

                                        {/* TARJETAS DE COMBUSTIBLE CON BOTÓN DE COPIAR */}
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-2 w-full max-w-[260px] mx-auto">

                                                {/* SÚPER */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 group/card hover:border-red-200 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-white dark:bg-red-900/40 rounded-md text-red-500 shadow-sm">
                                                            <Zap size={12} fill="currentColor" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Súper</span>
                                                            <span className="text-[10px] font-bold text-slate-400">{limits.super} Lts</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(superMonto, `${benefit.id}-super`)}
                                                        className="flex items-center gap-2 px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/50 border border-transparent hover:border-red-200 transition-all cursor-pointer group/btn"
                                                        title="Copiar monto exacto"
                                                    >
                                                        <span className="text-sm font-black text-slate-700 dark:text-white tabular-nums">
                                                            ₡{superMonto.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                        </span>
                                                        {copiedId === `${benefit.id}-super` ? (
                                                            <Check size={12} className="text-green-500 animate-in zoom-in" />
                                                        ) : (
                                                            <Copy size={12} className="text-slate-300 group-hover/btn:text-red-500 transition-colors" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* REGULAR */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 group/card hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-white dark:bg-blue-900/40 rounded-md text-blue-500 shadow-sm">
                                                            <Droplets size={12} fill="currentColor" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Regular</span>
                                                            <span className="text-[10px] font-bold text-slate-400">{limits.regular} Lts</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(regularMonto, `${benefit.id}-regular`)}
                                                        className="flex items-center gap-2 px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-transparent hover:border-blue-200 transition-all cursor-pointer group/btn"
                                                        title="Copiar monto exacto"
                                                    >
                                                        <span className="text-sm font-black text-slate-700 dark:text-white tabular-nums">
                                                            ₡{regularMonto.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                        </span>
                                                        {copiedId === `${benefit.id}-regular` ? (
                                                            <Check size={12} className="text-green-500 animate-in zoom-in" />
                                                        ) : (
                                                            <Copy size={12} className="text-slate-300 group-hover/btn:text-blue-500 transition-colors" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* DIESEL */}
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 group/card hover:border-emerald-200 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-white dark:bg-emerald-900/40 rounded-md text-emerald-500 shadow-sm">
                                                            <Fuel size={12} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Diesel</span>
                                                            <span className="text-[10px] font-bold text-slate-400">{limits.diesel} Lts</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(dieselMonto, `${benefit.id}-diesel`)}
                                                        className="flex items-center gap-2 px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer group/btn"
                                                        title="Copiar monto exacto"
                                                    >
                                                        <span className="text-sm font-black text-slate-700 dark:text-white tabular-nums">
                                                            ₡{dieselMonto.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                        </span>
                                                        {copiedId === `${benefit.id}-diesel` ? (
                                                            <Check size={12} className="text-green-500 animate-in zoom-in" />
                                                        ) : (
                                                            <Copy size={12} className="text-slate-300 group-hover/btn:text-emerald-500 transition-colors" />
                                                        )}
                                                    </button>
                                                </div>

                                            </div>
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="p-4 align-top flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            {isAdmin && (
                                                <>
                                                    <button onClick={() => onEdit(benefit)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"><Pencil size={16} /></button>
                                                    <button onClick={() => onDelete(benefit.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};