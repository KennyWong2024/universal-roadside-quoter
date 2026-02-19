import { useCostsContext, type TaxiRate } from '@/shared/context/CostsContext';

export type { TaxiRate };

export const useAirportRates = () => {
    const { airportRates, loading, refreshCosts } = useCostsContext();

    return {
        rates: airportRates,
        loading,
        refresh: refreshCosts
    };
};