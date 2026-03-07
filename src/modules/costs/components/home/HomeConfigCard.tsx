import { useState, useEffect } from 'react';
import { Home, Edit2, Clock, Route, DollarSign, Moon, Check, X, Loader2 } from 'lucide-react';
import { type ServiceTariff } from '@/shared/types/costs.types';

interface HomeConfigCardProps {
    data: ServiceTariff;
    onSave: (id: string, newData: any) => Promise<void>;
    isUpdating?: boolean;
}

export const HomeConfigCard = ({ data, onSave, isUpdating = false }: HomeConfigCardProps) => {
    const config = data.home_config;
    const format = (n: number) => `₡${n.toLocaleString('es-CR')}`;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fixed_fee_amount: 0,
        night_surcharge: 0,
        hourly_rates: [] as any[],
        mileage_ranges: [] as any[]
    });

    useEffect(() => {
        if (!isEditing && data) {
            setFormData({
                fixed_fee_amount: data.fixed_fee_amount || 0,
                night_surcharge: config?.night_surcharge || 0,
                hourly_rates: JSON.parse(JSON.stringify(config?.hourly_rates || [])),
                mileage_ranges: JSON.parse(JSON.stringify(config?.mileage_ranges || []))
            });
        }
    }, [data, config, isEditing]);

    const handleSave = async () => {
        const payload = {
            fixed_fee_amount: Number(formData.fixed_fee_amount),
            home_config: {
                night_surcharge: Number(formData.night_surcharge),
                hourly_rates: formData.hourly_rates.map(r => ({ ...r, cost: Number(r.cost) })),
                mileage_ranges: formData.mileage_ranges.map(r => ({ ...r, cost: Number(r.cost) }))
            }
        };

        await onSave(data.id, payload);
        setIsEditing(false);
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all ${isEditing ? 'border-emerald-500 shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-800 hover:shadow-md'}`}>
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <Home size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Matriz de Asistencia Hogar</h3>
                        <p className="text-xs text-slate-500">Tarifas por hora, kilometraje y fees</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <X size={14} /> CANCELAR
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                GUARDAR
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="Editar Configuración"
                        >
                            <Edit2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda: Fees y Horas */}
                <div className="space-y-6">
                    <div className={`flex flex-col gap-4 p-4 rounded-xl border ${isEditing ? 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <DollarSign size={16} className={isEditing ? 'text-emerald-500' : 'text-slate-400'} />
                                Fee Administrativo Fijo
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.fixed_fee_amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fixed_fee_amount: Number(e.target.value) }))}
                                    className="w-24 text-right px-2 py-1 text-sm border rounded-md border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:bg-slate-800 dark:border-emerald-700"
                                />
                            ) : (
                                <span className="font-bold text-slate-900 dark:text-white">{format(data.fixed_fee_amount || 0)}</span>
                            )}
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <Moon size={16} className={isEditing ? 'text-emerald-500' : 'text-slate-400'} />
                                Recargo Nocturno
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.night_surcharge}
                                    onChange={(e) => setFormData(prev => ({ ...prev, night_surcharge: Number(e.target.value) }))}
                                    className="w-24 text-right px-2 py-1 text-sm border rounded-md border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:bg-slate-800 dark:border-emerald-700"
                                />
                            ) : (
                                <span className="font-bold text-slate-900 dark:text-white">{format(config?.night_surcharge || 0)}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                            <Clock size={16} className="text-emerald-500" />
                            Tarifas por Tiempo de Trabajo
                        </h4>
                        <div className="space-y-2">
                            {(isEditing ? formData.hourly_rates : config?.hourly_rates)?.map((rate, index) => (
                                <div key={rate.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                                    <span className="text-slate-600 dark:text-slate-400">{rate.label}</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={rate.cost}
                                            onChange={(e) => {
                                                const newRates = [...formData.hourly_rates];
                                                newRates[index].cost = Number(e.target.value);
                                                setFormData(prev => ({ ...prev, hourly_rates: newRates }));
                                            }}
                                            className="w-28 text-right px-2 py-1 text-sm border rounded-md border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:bg-slate-800 dark:border-emerald-700"
                                        />
                                    ) : (
                                        <span className="font-medium text-slate-900 dark:text-white">{format(rate.cost)}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Kilometraje */}
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        <Route size={16} className="text-emerald-500" />
                        Costos de Kilometraje Adicional
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {(isEditing ? formData.mileage_ranges : config?.mileage_ranges)?.map((range, index) => (
                            <div key={range.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                                <span className="text-slate-600 dark:text-slate-400">{range.label}</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={range.cost}
                                        onChange={(e) => {
                                            const newRanges = [...formData.mileage_ranges];
                                            newRanges[index].cost = Number(e.target.value);
                                            setFormData(prev => ({ ...prev, mileage_ranges: newRanges }));
                                        }}
                                        className="w-28 text-right px-2 py-1 text-sm border rounded-md border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:bg-slate-800 dark:border-emerald-700"
                                    />
                                ) : (
                                    <span className="font-medium text-slate-900 dark:text-white">{format(range.cost)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};