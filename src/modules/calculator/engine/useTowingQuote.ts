import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { type Benefit } from '@/shared/hooks/useBenefits';
import { type Toll } from '@/shared/hooks/useTolls';

interface TariffRule {
    tiers: {
        base: {
            cost: number;
            included_km: number;
        };
        extra: {
            cost_per_km: number;
        };
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

export const useTowingQuote = (
    sdInput: number | string,
    maneuverInput: number | string,
    selectedTollsIds: string[],
    allTolls: Toll[],
    benefit: Benefit | null,
    currentExchangeRate: number
) => {
    const [quote, setQuote] = useState<QuoteResult>({
        serviceSubtotal: 0,
        benefitCovered: 0,
        clientExcedente: 0,
        taxAmount: 0,
        finalTotal: 0,
        breakdown: []
    });

    const [tariff, setTariff] = useState<TariffRule | null>(null);
    const [taxRule, setTaxRule] = useState<TaxRule | null>(null);
    const [rulesLoaded, setRulesLoaded] = useState(false);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const tariffRef = doc(db, 'service_tariffs', 'CR_towing_standard');
                const taxRef = doc(db, 'tax_configurations', 'CR_IVA_services');

                const [tariffSnap, taxSnap] = await Promise.all([
                    getDoc(tariffRef),
                    getDoc(taxRef)
                ]);

                if (tariffSnap.exists()) {
                    setTariff(tariffSnap.data() as TariffRule);
                } else {
                    console.error("❌ ERROR CRÍTICO: No se encontró la tarifa 'CR_towing_standard' en Firestore.");
                }

                if (taxSnap.exists()) {
                    setTaxRule(taxSnap.data() as TaxRule);
                } else {
                    console.error("❌ ERROR CRÍTICO: No se encontró la regla fiscal 'CR_IVA_services' en Firestore.");
                }

                setRulesLoaded(true);

            } catch (error) {
                console.error("❌ Error de conexión al cargar reglas de cotización:", error);
            }
        };

        fetchRules();
    }, []);

    useEffect(() => {
        if (!tariff || !taxRule || !rulesLoaded) return;

        const sd = Number(sdInput) || 0;
        const maneuver = Number(maneuverInput) || 0;

        const logs: string[] = [];
        let exchangeRateUsed: number | undefined = undefined;

        const baseKm = tariff.tiers.base.included_km;
        const baseCost = tariff.tiers.base.cost;
        const extraKmCost = tariff.tiers.extra.cost_per_km;

        let distanceCost = 0;

        if (sd <= baseKm) {
            distanceCost = sd > 0 ? baseCost : 0;
            if (sd > 0) logs.push(`Tarifa Base (${baseKm}km): ₡${baseCost}`);
        } else {
            const extraKm = sd - baseKm;
            distanceCost = baseCost + (extraKm * extraKmCost);
            logs.push(`Base (${baseKm}km): ₡${baseCost} + Extra (${extraKm}km): ₡${extraKm * extraKmCost}`);
        }

        const tollsCost = selectedTollsIds.reduce((sum, id) => {
            const toll = allTolls.find(t => t.id === id);
            return sum + (toll?.prices.tow || 0);
        }, 0);

        const totalServiceCost = distanceCost + maneuver + tollsCost;

        let clientPaysService = 0;
        let clientPaysTolls = 0;
        let coveredAmount = 0;

        if (benefit) {
            if (benefit.benefit_type === 'distance_cap') {
                const limitKm = benefit.limit_value;

                if (sd <= limitKm) {
                    coveredAmount = totalServiceCost;
                    logs.push(`✅ Cubierto por plan de ${limitKm} KM`);
                } else {
                    const excessKm = sd - limitKm;

                    clientPaysService = excessKm * extraKmCost;
                    clientPaysTolls = tollsCost;

                    coveredAmount = totalServiceCost - (clientPaysService + clientPaysTolls);
                    logs.push(`⚠️ Excede por ${excessKm} KM`);
                }
            } else {
                let limitMoney = benefit.limit_value;

                if (benefit.currency === 'USD') {
                    limitMoney = limitMoney * currentExchangeRate;
                    exchangeRateUsed = currentExchangeRate;
                }

                if (totalServiceCost <= limitMoney) {
                    coveredAmount = totalServiceCost;
                } else {
                    coveredAmount = limitMoney;
                    clientPaysService = totalServiceCost - limitMoney;
                }
            }
        } else {
            clientPaysService = distanceCost + maneuver;
            clientPaysTolls = tollsCost;
        }

        let tax = 0;
        const applyTax = taxRule.type === 'excess_only' || (taxRule as any).apply_to_excess === true;

        if (clientPaysService > 0 && applyTax) {
            tax = clientPaysService * taxRule.rate;
            logs.push(`IVA (${taxRule.rate * 100}% sobre ₡${clientPaysService}): ₡${tax}`);
        }

        const finalExcedente = clientPaysService + clientPaysTolls;
        const finalTotal = finalExcedente + tax;

        setQuote({
            serviceSubtotal: totalServiceCost,
            benefitCovered: coveredAmount,
            clientExcedente: finalExcedente,
            taxAmount: tax,
            finalTotal: finalTotal,
            breakdown: logs,
            exchangeRateUsed
        });

    }, [sdInput, maneuverInput, selectedTollsIds, benefit, tariff, taxRule, currentExchangeRate, rulesLoaded]);

    return { quote, rulesLoaded };
};