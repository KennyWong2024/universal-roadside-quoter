export interface FuelLimits {
    super: number;
    regular: number;
    diesel: number;
}

export interface FuelMetadata {
    cc_range: string;
    vehicle_type: string;
    zone: string;
}

export interface Benefit {
    id: string;
    partner_id?: string;
    partner_name: string;
    plan_name: string;
    service_category: string;
    benefit_type: 'monetary_cap' | 'distance_cap' | 'fuel_liters';
    limit_value?: number;
    currency?: 'CRC' | 'USD' | null;
    active?: boolean;
    apply_airport_fee?: boolean;
    fuel_limits?: FuelLimits;
    fuel_metadata?: FuelMetadata;
}

import { useBenefitsContext } from '../../../shared/context/BenefitsContext';

export const useBenefitsMatrix = () => {
    const { benefits, loading, refreshBenefits } = useBenefitsContext();

    return {
        benefits,
        loading,
        refresh: refreshBenefits
    };
};