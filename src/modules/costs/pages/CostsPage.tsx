import { useState } from 'react';
import { Info, Plane, Settings, Plus } from 'lucide-react';
import { useCostMatrix } from '../hooks/useCostMatrix';
import { useUpdateCost } from '../hooks/useUpdateCost';
import { useAirportRates, type TaxiRate } from '../hooks/useAirportRates';
import { useAirportRatesManager } from '../hooks/useAirportRatesManager';

import { AirportRatesTable } from '../components/taxi/AirportRatesTable';
import { AirportRatesFilters } from '../components/taxi/AirportRatesFilters';
import { RateFormModal } from '../components/taxi/RateFormModal';

import { TariffCard } from '../components/TariffCard';
import { FuelCard } from '../components/FuelCard';
import { TollsTableCard } from '../components/TollsTableCard';

export const CostsPage = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'taxi'>('general');
    const [filters, setFilters] = useState({ province: '', canton: '', district: '' });

    const [isRateModalOpen, setIsRateModalOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState<TaxiRate | null>(null);

    const { tariffs, tolls, fuel, loading: loadingMatrix } = useCostMatrix();
    const { rates: airportRates, loading: loadingRates } = useAirportRates();
    const { updateCostDocument } = useUpdateCost();
    const { saveRate } = useAirportRatesManager();

    const filteredRates = airportRates.filter(rate => {
        const matchesProvince = filters.province ? rate.location.province === filters.province : true;
        const matchesCanton = filters.canton ? rate.location.canton === filters.canton : true;
        const matchesDistrict = filters.district ? rate.location.district === filters.district : true;
        return matchesProvince && matchesCanton && matchesDistrict;
    });

    if (loadingMatrix || loadingRates) {
        return <div className="p-8 text-slate-500 animate-pulse text-center">Cargando matriz...</div>;
    }

    const handleEditRate = (rate: TaxiRate) => {
        setSelectedRate(rate);
        setIsRateModalOpen(true);
    };

    const handleNewRate = () => {
        setSelectedRate(null);
        setIsRateModalOpen(true);
    };

    const handleSaveTariff = async (id: string, newData: any) => {
        await updateCostDocument('service_tariffs', id, newData);
    };
    const handleSaveToll = async (id: string, newPrices: any) => {
        await updateCostDocument('tolls_matrix', id, { prices: newPrices });
    };
    const handleSaveFuel = async (newPrices: any) => {
        await updateCostDocument('fuel_prices', 'CR_current_prices', { prices: newPrices });
    };

    const towing = tariffs.find((t: any) => t.service_category === 'towing');
    const heavy = tariffs.find((t: any) => t.service_category === 'heavy');
    const taxi = tariffs.find((t: any) => t.service_category === 'taxi');
    const route27Tolls = tolls.filter((t: any) => t.route === 'Ruta 27');
    const nationalTolls = tolls.filter((t: any) => t.route !== 'Ruta 27');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                        <Info size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Matriz de Costos</h2>
                        <p className="text-sm text-slate-500">Configuración global del sistema</p>
                    </div>
                </div>

                <div className="flex flex-wrap p-1 bg-slate-200 dark:bg-slate-800/50 rounded-xl backdrop-blur-md border border-slate-300 dark:border-slate-700/50">
                    <TabButton
                        isActive={activeTab === 'general'}
                        onClick={() => setActiveTab('general')}
                        icon={<Settings size={18} />}
                        label="Costos Generales"
                    />
                    <TabButton
                        isActive={activeTab === 'taxi'}
                        onClick={() => setActiveTab('taxi')}
                        icon={<Plane size={18} />}
                        label="Rutas Aeropuerto"
                    />
                </div>
            </div>

            {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {towing && <TariffCard title="Grúa Liviana" type="towing" data={towing} onSave={handleSaveTariff} />}
                        {heavy && <TariffCard title="Grúa Pesada" type="heavy" data={heavy} onSave={handleSaveTariff} />}
                        {taxi && <TariffCard title="Taxi (Base)" type="taxi" data={taxi} onSave={handleSaveTariff} />}
                        {fuel && <FuelCard data={fuel} onSave={handleSaveFuel} />}
                    </div>

                    <div className="space-y-8 pt-4">
                        <TollsTableCard title="Peajes - Ruta 27" tolls={route27Tolls} onSave={handleSaveToll} />
                        <TollsTableCard title="Peajes - Otros" tolls={nationalTolls} onSave={handleSaveToll} />
                    </div>
                </div>
            )}

            {activeTab === 'taxi' && (
                <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                    <div className="flex flex-col xl:flex-row gap-6 justify-between items-start bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-full xl:flex-1">
                            <AirportRatesFilters
                                rates={airportRates}
                                onFilterChange={setFilters}
                            />
                        </div>

                        <div className="w-full xl:w-auto flex justify-end xl:mt-6">
                            <button
                                onClick={handleNewRate}
                                className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all w-full xl:w-auto justify-center"
                            >
                                <Plus size={18} /> AGREGAR TARIFA
                            </button>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-medium px-2">
                        Mostrando {filteredRates.length} tarifas de {airportRates.length} totales
                    </div>

                    <AirportRatesTable
                        rates={filteredRates}
                        onEdit={handleEditRate}
                    />

                    <RateFormModal
                        isOpen={isRateModalOpen}
                        onClose={() => setIsRateModalOpen(false)}
                        onSave={saveRate}
                        existingRates={airportRates}
                        initialData={selectedRate}
                    />
                </div>
            )}

            <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center mt-12">
                <p className="text-xs text-slate-500">
                    Los cambios realizados aquí afectan globalmente a todos los cotizadores del sistema.
                </p>
            </div>
        </div>
    );
};

const TabButton = ({ isActive, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`
      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
      ${isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'}
    `}
    >
        {icon}
        <span>{label}</span>
    </button>
);