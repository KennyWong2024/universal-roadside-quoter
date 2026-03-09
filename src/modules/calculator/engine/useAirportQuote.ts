import { useState, useMemo } from 'react';
import { useAirportRates, type TaxiRate } from '@/modules/costs/hooks/useAirportRates';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useCostMatrix } from '@/modules/costs/hooks/useCostMatrix';

export const useAirportQuote = (currentExchangeRate: number) => {
    const [selectedRoute, setSelectedRoute] = useState<TaxiRate | null>(null);
    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');

    const { rates, loading: loadingRates } = useAirportRates();
    const { benefits, loading: loadingBenefits } = useBenefits('airport');
    const { tariffs } = useCostMatrix();

    const airportConfig = useMemo(() => {
        const configDoc = tariffs.find((t: any) => t.service_category === 'airport');

        return {
            multiplier: configDoc?.airport_config?.fee_multiplier || 1.34,
            parking: configDoc?.airport_config?.parking_cost || 1600,
            iva: 0.13
        };
    }, [tariffs]);

    const airportBenefits = useMemo(() => benefits, [benefits]);

    const calculation = useMemo(() => {
        if (!selectedRoute) return null;

        const basePrice = selectedRoute.price;
        const isRoundTrip = tripType === 'round_trip';

        const appliesFee = selectedBenefit?.apply_airport_fee !== undefined
            ? selectedBenefit.apply_airport_fee
            : true;

        // 1. Calculamos el costo base con o sin fee
        const costWithFee = appliesFee
            ? (basePrice * airportConfig.multiplier)
            : basePrice;

        // 2. Multiplicamos los trayectos (x1 si es One Way, x2 si es Round Trip)
        const providerCostTotal = isRoundTrip ? (basePrice * 2) : basePrice;
        const tripCostTotal = isRoundTrip ? (costWithFee * 2) : costWithFee;

        // 3. Sumamos el parqueo UNA SOLA VEZ al costo total
        const subtotalClient = tripCostTotal + airportConfig.parking;

        let benefitAmount = 0;
        if (selectedBenefit) {
            if (selectedBenefit.benefit_type === 'monetary_cap') {
                benefitAmount = selectedBenefit.currency === 'USD'
                    ? selectedBenefit.limit_value * currentExchangeRate
                    : selectedBenefit.limit_value;
            }
        }

        // 4. Aplicamos el beneficio al total de la cotización
        const rawExcedent = Math.max(0, subtotalClient - benefitAmount);
        const taxAmount = rawExcedent > 0 ? rawExcedent * airportConfig.iva : 0;
        const grandTotal = rawExcedent + taxAmount;

        return {
            providerCost: providerCostTotal,
            clientCostBase: subtotalClient,
            benefitApplied: benefitAmount,
            excedentNet: rawExcedent,
            tax: taxAmount,
            grandTotal: grandTotal,
            params: {
                fee: appliesFee ? airportConfig.multiplier : 1,
                parking: airportConfig.parking,
                isRoundTrip: isRoundTrip,
                exchangeRateUsed: selectedBenefit?.currency === 'USD' ? currentExchangeRate : undefined
            }
        };

    }, [selectedRoute, selectedBenefit, tripType, airportConfig, currentExchangeRate]);

    const generateNote = () => {
        if (!selectedRoute || !selectedBenefit || !calculation) return "";

        const locationStr = `${selectedRoute.location.province}, ${selectedRoute.location.canton}, ${selectedRoute.location.district}`.toUpperCase();
        const fmt = (n: number) => `₡${n.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const benefitLabel = selectedBenefit.currency === 'USD'
            ? `$${selectedBenefit.limit_value} USD (T.C. ${currentExchangeRate})`
            : fmt(selectedBenefit.limit_value);

        const feeText = calculation.params.fee > 1
            ? '(Inc. Fee y Parqueo)'
            : '(Sin Fee, Inc. Parqueo)';

        return `
TAXI AEROPUERTO: ${selectedBenefit.partner_name.toUpperCase()} - ${selectedBenefit.plan_name.toUpperCase()}
COTIZACIÓN: ${locationStr}
AEROPUERTO: ${selectedRoute.airport_id} (${calculation.params.isRoundTrip ? 'IDA Y VUELTA' : 'SOLO IDA'})

COSTO PROVEEDOR: ${fmt(calculation.providerCost)}
COSTO CLIENTE: ${fmt(calculation.clientCostBase)} ${feeText}
BENEFICIO APLICADO: ${benefitLabel}

EXCEDENTE NETO: ${fmt(calculation.excedentNet)} + IVA
--------------------------------
TOTAL A COBRAR CLIENTE: ${fmt(calculation.grandTotal)}
`.trim();
    };

    return {
        airportBenefits,
        rates,
        loading: loadingRates || loadingBenefits,
        selectedRoute, setSelectedRoute,
        selectedBenefit, setSelectedBenefit,
        tripType, setTripType,
        calculation,
        generateNote
    };
};