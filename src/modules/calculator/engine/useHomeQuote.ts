import { useState, useMemo } from 'react';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useHomeRates } from '@/shared/hooks/useHomeRates';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';

export interface HomeCalculation {
    laborCost: number;
    mileageCost: number;
    materialsCost: number;
    nightSurcharge: number;
    providerTotal: number;
    fixedFee: number;
    clientSubtotal: number;
    benefitApplied: number;
    excedentNet: number;
    tax: number;
    grandTotal: number;
    hasExcedente: boolean;
    exchangeRateUsed?: number;
    benefitCurrency?: string | null;
}

export const useHomeQuote = () => {
    const { rate: exchangeRate } = useExchangeRate();
    const { benefits, loading: loadingBenefits } = useBenefits('home');
    const {
        hourlyRates,
        mileageRanges,
        fixedFee,
        nightSurcharge: baseNightSurcharge,
        loading: loadingRates
    } = useHomeRates();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [selectedHoursId, setSelectedHoursId] = useState<string>('');
    const [selectedMileageId, setSelectedMileageId] = useState<string>('');
    const [materialCost, setMaterialCost] = useState<string>('');
    const [isNightShift, setIsNightShift] = useState<boolean>(false);

    const selectedHourOption = useMemo(() =>
        hourlyRates.find(h => h.id === selectedHoursId),
        [hourlyRates, selectedHoursId]);

    const selectedMileageOption = useMemo(() =>
        mileageRanges.find(m => m.id === selectedMileageId),
        [mileageRanges, selectedMileageId]);

    const calculation = useMemo<HomeCalculation | null>(() => {
        if (!selectedBenefit || !selectedHourOption || !selectedMileageOption) {
            return null;
        }

        const laborCost = selectedHourOption.cost;
        const mileageCost = selectedMileageOption.cost;
        const materialsCost = Number(materialCost) || 0;
        const nightCost = isNightShift ? baseNightSurcharge : 0;

        const providerTotal = laborCost + mileageCost + materialsCost + nightCost;
        const clientSubtotal = providerTotal + fixedFee;

        let benefitAmount = 0;
        if (selectedBenefit.benefit_type === 'monetary_cap') {
            benefitAmount = selectedBenefit.currency === 'USD'
                ? (selectedBenefit.limit_value || 0) * exchangeRate
                : (selectedBenefit.limit_value || 0);
        }

        const rawExcedent = Math.max(0, clientSubtotal - benefitAmount);
        const taxAmount = rawExcedent > 0 ? rawExcedent * 0.13 : 0;
        const grandTotal = rawExcedent + taxAmount;

        return {
            laborCost,
            mileageCost,
            materialsCost,
            nightSurcharge: nightCost,
            providerTotal,
            fixedFee,
            clientSubtotal,
            benefitApplied: benefitAmount,
            excedentNet: rawExcedent,
            tax: taxAmount,
            grandTotal,
            hasExcedente: rawExcedent > 0,
            exchangeRateUsed: selectedBenefit.currency === 'USD' ? exchangeRate : undefined,
            benefitCurrency: selectedBenefit.currency
        };
    }, [
        selectedBenefit, selectedHourOption, selectedMileageOption,
        materialCost, isNightShift, fixedFee, baseNightSurcharge, exchangeRate
    ]);

    const generateNote = () => {
        if (!selectedBenefit || !calculation) return "";

        const fmt = (n: number) => `₡${Math.round(n).toLocaleString('es-CR')}`;
        const benefitLabel = selectedBenefit.currency === 'USD'
            ? `$${selectedBenefit.limit_value} USD (T.C. ${exchangeRate})`
            : fmt(selectedBenefit.limit_value || 0);

        return `
ASISTENCIA HOGAR: ${selectedBenefit.partner_name.toUpperCase()} - ${selectedBenefit.plan_name.toUpperCase()}
TIEMPO ESTIMADO: ${selectedHourOption?.label.toUpperCase()}
KM EXTRA: ${selectedMileageOption?.label.toUpperCase()}
HORARIO: ${isNightShift ? 'NOCTURNO' : 'DIURNO'}

COSTO PROVEEDOR: ${fmt(calculation.providerTotal)}
MATERIALES INCLUIDOS: ${fmt(calculation.materialsCost)}
FEE ADMINISTRATIVO: ${fmt(calculation.fixedFee)}

COSTO TOTAL CLIENTE: ${fmt(calculation.clientSubtotal)}
BENEFICIO APLICADO: ${benefitLabel}

EXCEDENTE NETO: ${fmt(calculation.excedentNet)} + IVA (13%)
--------------------------------
TOTAL A COBRAR CLIENTE: ${fmt(calculation.grandTotal)}
`.trim();
    };

    return {
        benefits,
        hourlyRates,
        mileageRanges,
        loading: loadingBenefits || loadingRates,
        selectedBenefit, setSelectedBenefit,
        selectedHoursId, setSelectedHoursId,
        selectedMileageId, setSelectedMileageId,
        materialCost, setMaterialCost,
        isNightShift, setIsNightShift,
        selectedHourOption,
        selectedMileageOption,
        calculation,
        generateNote
    };
};