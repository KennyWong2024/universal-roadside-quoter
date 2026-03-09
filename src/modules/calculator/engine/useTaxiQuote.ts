import { useMemo } from 'react';
import { useCostsContext } from '@/shared/context/CostsContext';
import { type Benefit } from '@/shared/types/benefits.types';
import { type Toll } from '@/shared/hooks/useTolls';

export interface TaxiCalculation {
    ps: number;
    sd: number;
    cost2Points: number;
    cost3Points: number;
    tollsCost: number;
    benefitApplied: number;
    excedentNet: number;
    tax: number;
    grandTotal: number;
    exchangeRateUsed?: number;
    benefitCurrency?: string | null;
}

export const useTaxiQuote = (
    psInput: number | string,
    sdInput: number | string,
    vehicleType: 'light' | 'microbus',
    selectedTollsIds: string[],
    allTolls: Toll[],
    benefit: Benefit | null,
    currentExchangeRate: number
) => {
    const { tariffs, loading: loadingCosts } = useCostsContext();

    const calculation = useMemo<TaxiCalculation | null>(() => {
        if (!benefit) return null;

        // Extraemos el costo base de la base de datos
        const tariff = tariffs.find(t => t.id === 'CR_taxi_standard');
        const costPerKm = tariff?.tiers?.extra?.cost_per_km || 815;

        const ps = Number(psInput) || 0;
        const sd = Number(sdInput) || 0;

        // Sumamos peajes según el tipo de vehículo (light = automóvil, microbus = buseta)
        const tollsCost = selectedTollsIds.reduce((sum, id) => {
            const toll = allTolls.find(t => t.id === id);
            return sum + (toll?.prices[vehicleType] || 0);
        }, 0);

        // Fórmulas principales
        const cost2Points = (sd * costPerKm) + tollsCost;
        const cost3Points = ((ps + sd) * costPerKm) + tollsCost;

        // Lógica de Cobertura
        let benefitLimit = benefit.limit_value || 0;
        let exchangeRateUsed: number | undefined = undefined;

        if (benefit.currency === 'USD') {
            exchangeRateUsed = currentExchangeRate;
            benefitLimit = benefitLimit * currentExchangeRate;
        }

        // El beneficio aplica sobre el viaje del cliente (2 Puntos)
        const benefitApplied = Math.min(cost2Points, benefitLimit);
        const excedentNet = Math.max(0, cost2Points - benefitLimit);

        // IVA solo sobre el excedente
        const tax = excedentNet > 0 ? excedentNet * 0.13 : 0;

        return {
            ps,
            sd,
            cost2Points,
            cost3Points,
            tollsCost,
            benefitApplied,
            excedentNet,
            tax,
            grandTotal: excedentNet + tax,
            exchangeRateUsed,
            benefitCurrency: benefit.currency
        };
    }, [psInput, sdInput, vehicleType, selectedTollsIds, allTolls, benefit, tariffs, currentExchangeRate]);

    return { calculation, loadingCosts };
};