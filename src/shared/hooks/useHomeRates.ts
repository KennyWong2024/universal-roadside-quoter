import { useMemo } from 'react';
import { useCostsContext } from '@/shared/context/CostsContext';
import { type ServiceTariff } from '@/shared/types/costs.types';

export const useHomeRates = () => {
    const { tariffs, loading } = useCostsContext();
    const homeTariff = useMemo<ServiceTariff | undefined>(() => {
        return tariffs.find(t => t.service_category === 'home' && t.id === 'CR_home_standard');
    }, [tariffs]);

    return {
        loading,
        homeTariff,
        fixedFee: homeTariff?.fixed_fee_amount || 0,
        nightSurcharge: homeTariff?.home_config?.night_surcharge || 0,
        hourlyRates: homeTariff?.home_config?.hourly_rates || [],
        mileageRanges: homeTariff?.home_config?.mileage_ranges || []
    };
};