export interface TaxiRate {
    id: string;
    active: boolean;
    airport_id: string;
    country: string;
    currency: string;
    price: number;
    location: {
        province: string;
        canton: string;
        district: string;
    };
    search_keywords?: string[];
}

export interface ServiceTariff {
    id: string;
    fixed_fee_amount?: number;
    pricing_model?: string;
    country_code?: string;
    currency?: string;
    service_category?: string;

    billing_rules?: {
        charge_ps?: boolean;
        charge_sd?: boolean;
    };

    tiers?: {
        base: {
            cost: number;
            included_km: number;
        };
        extra: {
            cost_per_km: number;
        };
    };

    airport_config?: {
        fee_multiplier: number;
        parking_cost: number;
        country_code?: string;
        currency?: string;
        service_category?: string;
    };
}

export interface HomeHourlyRate {
    id: string;
    label: string;
    cost: number;
}

export interface HomeMileageRange {
    id: string;
    label: string;
    cost: number;
}

export interface ServiceTariff {
    id: string;
    fixed_fee_amount?: number;
    pricing_model?: string;
    country_code?: string;
    currency?: string;
    service_category?: string;

    billing_rules?: {
        charge_ps?: boolean;
        charge_sd?: boolean;
    };

    tiers?: {
        base: {
            cost: number;
            included_km: number;
        };
        extra: {
            cost_per_km: number;
        };
    };

    airport_config?: {
        fee_multiplier: number;
        parking_cost: number;
        country_code?: string;
        currency?: string;
        service_category?: string;
    };

    home_config?: {
        night_surcharge: number;
        hourly_rates: HomeHourlyRate[];
        mileage_ranges: HomeMileageRange[];
    };
}