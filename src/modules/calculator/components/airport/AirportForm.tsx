import { useMemo } from 'react';
import { Plane, MapPin } from 'lucide-react';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { useAirportQuote } from '../../engine/useAirportQuote';
import { AirportCostBreakdown } from './AirportCostBreakdown';
import { AirportNotePreview } from './AirportNotePreview';

export const AirportForm = () => {
    const { rate: exchangeRate } = useExchangeRate();

    const {
        airportBenefits,
        rates,
        selectedRoute, setSelectedRoute,
        selectedBenefit, setSelectedBenefit,
        tripType, setTripType,
        calculation, generateNote
    } = useAirportQuote(exchangeRate);

    const partnerOptions = useMemo(() => airportBenefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name} (${b.benefit_type === 'monetary_cap' ? `${b.currency} ${b.limit_value}` : 'KM'})`
    })), [airportBenefits]);

    const routeOptions = useMemo(() => rates.map(r => ({
        id: r.id,
        label: `${r.location.province}, ${r.location.canton}, ${r.location.district}`,
        subLabel: `Aeropuerto: ${r.airport_id}`
    })), [rates]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="xl:col-span-2 space-y-8">
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                        <Plane size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Datos del Viaje</h3>
                    </div>

                    <SearchableSelect
                        label="Socio y Plan"
                        placeholder="Seleccione el plan..."
                        options={partnerOptions}
                        value={selectedBenefit?.id || ''}
                        onChange={(id) => {
                            const b = airportBenefits.find(x => x.id === id);
                            setSelectedBenefit(b || null);
                        }}
                    />

                    <SearchableSelect
                        label="Destino (Provincia, Cantón, Distrito)"
                        placeholder="Buscar ubicación..."
                        options={routeOptions}
                        value={selectedRoute?.id || ''}
                        onChange={(id) => {
                            const r = rates.find(x => x.id === id);
                            setSelectedRoute(r || null);
                        }}
                    />

                    {selectedRoute && (
                        <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300 flex items-center gap-3">
                            <MapPin size={16} />
                            <div>
                                <span className="block font-bold">
                                    {selectedRoute.location.province}, {selectedRoute.location.canton}, {selectedRoute.location.district}
                                </span>
                                <span className="opacity-80">
                                    Aeropuerto: {selectedRoute.airport_id} • Tarifa Base: ₡{selectedRoute.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Tipo de Servicio
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setTripType('one_way')}
                                className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2
                                    ${tripType === 'one_way'
                                        ? 'bg-sky-50 border-sky-500 text-sky-700 dark:bg-sky-900/20 dark:border-sky-500 dark:text-sky-400 shadow-md shadow-sky-500/10'
                                        : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-sky-300'}`}
                            >
                                <span className="text-lg">➝</span>
                                Solo Ida
                            </button>
                            <button
                                onClick={() => setTripType('round_trip')}
                                className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2
                                    ${tripType === 'round_trip'
                                        ? 'bg-sky-50 border-sky-500 text-sky-700 dark:bg-sky-900/20 dark:border-sky-500 dark:text-sky-400 shadow-md shadow-sky-500/10'
                                        : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-sky-300'}`}
                            >
                                <span className="text-lg">⇆</span>
                                Ida y Vuelta
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="xl:col-span-1 space-y-6 sticky top-8 h-fit">
                <AirportCostBreakdown
                    calculation={calculation}
                />

                <AirportNotePreview
                    selectedRoute={selectedRoute}
                    selectedBenefit={selectedBenefit}
                    calculation={calculation}
                    tripType={tripType}
                    generateNote={generateNote}
                />
            </div>
        </div>
    );
};