import { Plane, MapPin, Pencil } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { type TaxiRate } from '../../hooks/useAirportRates';

interface AirportRatesTableProps {
    rates: TaxiRate[];
}

export const AirportRatesTable = ({ rates }: AirportRatesTableProps) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/10 text-sky-600 rounded-lg">
                        <Plane size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">
                            Tarifas Taxi Aeropuerto
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Base de datos de rutas oficiales desde aeropuertos
                        </p>
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {rates.length} RUTAS
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/4">Provincia</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/4">Cantón</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase w-1/4">Distrito</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center w-24">Aeropuerto</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-right w-32">Tarifa</th>
                            <th className="p-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {rates.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400 italic text-sm">
                                    No hay tarifas registradas. Añade documentos en Firebase.
                                </td>
                            </tr>
                        ) : (
                            rates.map((rate) => (
                                <tr key={rate.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row">

                                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-300" />
                                            {rate.location.province}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{rate.location.canton}</td>
                                    <td className="p-4 text-sm font-bold text-slate-700 dark:text-slate-200">{rate.location.district}</td>

                                    <td className="p-4 text-center">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tight
                      ${rate.airport_id === 'SJO'
                                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                            }
                    `}>
                                            {rate.airport_id}
                                        </span>
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="font-bold text-slate-800 dark:text-white">
                                            ₡{rate.price.toLocaleString('es-CR')}
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        {isAdmin && (
                                            <button
                                                className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all opacity-0 group-hover/row:opacity-100"
                                                title="Editar tarifa (Próximamente)"
                                            >
                                                <Pencil size={14} />
                                            </button>
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