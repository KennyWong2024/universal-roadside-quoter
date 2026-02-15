import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { type Benefit } from '@/shared/hooks/useBenefits';
import { type Toll } from '@/shared/hooks/useTolls';

interface TariffRule {
    billing_rules: {
        charge_ps: boolean;
        charge_sd: boolean;
    };
    tiers: {
        base: { cost: number; included_km: number };
        extra: { cost_per_km: number };
    };
}

interface TaxRule {
    rate: number;
    type: string;
}

export interface QuoteResult {
    serviceSubtotal: number;
    benefitCovered: number;
    clientExcedente: number;
    taxAmount: number;
    finalTotal: number;
    breakdown: string[];
    exchangeRateUsed?: number;
}

export const useHeavyQuote = (
    psInput: number,
    sdInput: number,
    maneuverInput: number,
    selectedTollsIds: string[],
    allTolls: Toll[],
    benefit: Benefit | null,
    currentExchangeRate: number
) => {
    const [quote, setQuote] = useState<QuoteResult>({
        serviceSubtotal: 0, benefitCovered: 0, clientExcedente: 0, taxAmount: 0, finalTotal: 0, breakdown: []
    });

    const [tariff, setTariff] = useState<TariffRule | null>(null);
    const [taxRule, setTaxRule] = useState<TaxRule | null>(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const tariffRef = doc(db, 'service_tariffs', 'CR_heavy_towing');
                const taxRef = doc(db, 'tax_configurations', 'CR_IVA_services');

                const [tariffSnap, taxSnap] = await Promise.all([getDoc(tariffRef), getDoc(taxRef)]);

                if (tariffSnap.exists()) setTariff(tariffSnap.data() as TariffRule);
                if (taxSnap.exists()) setTaxRule(taxSnap.data() as TaxRule);
            } catch (error) {
                console.error("Error cargando reglas pesadas:", error);
            }
        };
        fetchRules();
    }, []);

    useEffect(() => {
        if (!tariff || !taxRule) return;

        const logs: string[] = [];
        let exchangeRateUsed: number | undefined = undefined;

        const chargePs = tariff.billing_rules.charge_ps ? psInput : 0;
        const chargeSd = tariff.billing_rules.charge_sd ? sdInput : 0;
        const totalKmToCharge = chargePs + chargeSd;

        const baseKm = tariff.tiers.base.included_km;
        const baseCost = tariff.tiers.base.cost;
        const extraKmCost = tariff.tiers.extra.cost_per_km;

        let distanceCost = 0;

        if (totalKmToCharge <= baseKm) {
            distanceCost = totalKmToCharge > 0 ? baseCost : 0;
            if (totalKmToCharge > 0) logs.push(`Tarifa Base Heavy (${baseKm}km): ₡${baseCost}`);
        } else {
            const extraKm = totalKmToCharge - baseKm;
            distanceCost = baseCost + (extraKm * extraKmCost);
            logs.push(`Base (${baseKm}km): ₡${baseCost} + Extra (${extraKm}km): ₡${extraKm * extraKmCost}`);
        }

        const tollsCost = selectedTollsIds.reduce((sum, id) => {
            const toll = allTolls.find(t => t.id === id);
            const price = toll?.prices.heavy || toll?.prices.tow || 0;
            return sum + price;
        }, 0);

        const totalServiceCost = distanceCost + maneuverInput + tollsCost;

        let coveredAmount = 0;
        let clientPays = 0;

        if (benefit) {
            let limitMoney = benefit.limit_value;
            if (benefit.currency === 'USD') {
                limitMoney = limitMoney * currentExchangeRate;
                exchangeRateUsed = currentExchangeRate;
            }

            if (totalServiceCost <= limitMoney) {
                coveredAmount = totalServiceCost;
            } else {
                coveredAmount = limitMoney;
                clientPays = totalServiceCost - limitMoney;
            }
        } else {
            clientPays = totalServiceCost;
        }

        let tax = 0;
        if (clientPays > 0 && taxRule.type === 'excess_only') {
            tax = clientPays * taxRule.rate;
        }

        setQuote({
            serviceSubtotal: totalServiceCost,
            benefitCovered: coveredAmount,
            clientExcedente: clientPays,
            taxAmount: tax,
            finalTotal: clientPays + tax,
            breakdown: logs,
            exchangeRateUsed
        });

    }, [psInput, sdInput, maneuverInput, selectedTollsIds, benefit, tariff, taxRule, currentExchangeRate]);

    return { quote };
};