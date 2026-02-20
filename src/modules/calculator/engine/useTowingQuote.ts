import { useState, useEffect, useMemo } from 'react';
import { useCostsContext } from '@/shared/context/CostsContext';
import { type Benefit } from '@/shared/types/benefits.types';
import { type Toll } from '@/shared/hooks/useTolls';

export interface QuoteResult {
    serviceSubtotal: number;
    benefitCovered: number;
    clientExcedente: number;
    taxAmount: number;
    finalTotal: number;
    breakdown: string[];
    exchangeRateUsed?: number;
}

export const useTowingQuote = (
    sdInput: number | string,
    maneuverInput: number | string,
    selectedTollsIds: string[],
    allTolls: Toll[],
    benefit: Benefit | null,
    currentExchangeRate: number
) => {
    const { tariffs, loading: loadingCosts } = useCostsContext();

    const tariff = useMemo(() =>
        tariffs.find(t => t.id === 'CR_towing_standard'),
        [tariffs]);

    const [quote, setQuote] = useState<QuoteResult>({
        serviceSubtotal: 0, benefitCovered: 0, clientExcedente: 0,
        taxAmount: 0, finalTotal: 0, breakdown: []
    });

    useEffect(() => {
        if (!tariff || !tariff.tiers || loadingCosts) return;

        const sd = Number(sdInput) || 0;
        const maneuver = Number(maneuverInput) || 0;
        const logs: string[] = [];
        let exchangeRateUsed: number | undefined = undefined;

        const { base, extra } = tariff.tiers;
        let distanceCost = sd <= base.included_km
            ? (sd > 0 ? base.cost : 0)
            : base.cost + ((sd - base.included_km) * extra.cost_per_km);

        if (sd > 0) logs.push(`Tarifa Base: ₡${distanceCost.toLocaleString()}`);

        const tollsCost = selectedTollsIds.reduce((sum, id) => {
            const toll = allTolls.find(t => t.id === id);
            return sum + (toll?.prices.tow || 0);
        }, 0);

        let fixedFee = 0;

        if (benefit?.apply_fixed_fee === true) {
            fixedFee = tariff.fixed_fee_amount || 0;

            if (fixedFee > 0) {
                logs.push(`Fee Administrativo: ₡${fixedFee.toLocaleString()}`);
            }
        }

        const totalServiceCost = distanceCost + maneuver + tollsCost + fixedFee;

        let limitMoney = benefit?.limit_value || 0;

        if (benefit?.currency === 'USD') {
            exchangeRateUsed = currentExchangeRate;
            limitMoney = limitMoney * currentExchangeRate;
        }

        const coveredAmount = Math.min(totalServiceCost, limitMoney);
        const clientPaysService = totalServiceCost - coveredAmount;

        const tax = clientPaysService * 0.13;
        if (tax > 0) logs.push(`IVA (13%): ₡${Math.round(tax).toLocaleString()}`);

        setQuote({
            serviceSubtotal: totalServiceCost,
            benefitCovered: coveredAmount,
            clientExcedente: clientPaysService,
            taxAmount: tax,
            finalTotal: clientPaysService + tax,
            breakdown: logs,
            exchangeRateUsed
        });

    }, [sdInput, maneuverInput, selectedTollsIds, benefit, tariff, currentExchangeRate, loadingCosts]);

    return { quote, rulesLoaded: !loadingCosts };
};