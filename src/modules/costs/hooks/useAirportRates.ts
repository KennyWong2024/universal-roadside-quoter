import { useCostsContext } from '@/shared/context/CostsContext';
import { type TaxiRate } from '@/shared/types/costs.types';

export type { TaxiRate };

export const useAirportRates = () => {
    const { airportRates, loading, refreshCosts } = useCostsContext();

    return {
        rates: airportRates,
        loading,
        refresh: refreshCosts
    };
};