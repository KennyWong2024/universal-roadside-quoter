import { Info } from 'lucide-react';
import { useCostMatrix } from '../hooks/useCostMatrix';
import { useUpdateCost } from '../hooks/useUpdateCost';
import { TariffCard } from '../components/TariffCard';
import { FuelCard } from '../components/FuelCard';
import { TollsTableCard } from '../components/TollsTableCard';

export const CostsPage = () => {
    const { tariffs, tolls, fuel, loading } = useCostMatrix();
    const { updateCostDocument } = useUpdateCost();

    if (loading) return <div className="p-8 text-slate-500 animate-pulse text-center">Cargando matriz...</div>;

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                    <Info size={22} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Matriz de Costos</h2>
                    <p className="text-sm text-slate-500">Gestión de tarifas base, peajes y combustibles</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {towing && <TariffCard title="Grúa Liviana" type="towing" data={towing} onSave={handleSaveTariff} />}
                {heavy && <TariffCard title="Grúa Pesada" type="heavy" data={heavy} onSave={handleSaveTariff} />}
                {taxi && <TariffCard title="Taxi (Normal)" type="taxi" data={taxi} onSave={handleSaveTariff} />}
                {fuel && <FuelCard data={fuel} onSave={handleSaveFuel} />}
            </div>

            <div className="space-y-8">
                <TollsTableCard title="Peajes - Ruta 27" tolls={route27Tolls} onSave={handleSaveToll} />
                <TollsTableCard title="Peajes Nacionales (Aislados)" tolls={nationalTolls} onSave={handleSaveToll} />
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500">
                    Los cambios realizados aquí afectan globalmente a todos los cotizadores del sistema.
                </p>
            </div>
        </div>
    );
};