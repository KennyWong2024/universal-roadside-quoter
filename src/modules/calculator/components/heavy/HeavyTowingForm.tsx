import { useState } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { CheckboxChip } from '@/shared/ui/forms/CheckboxChip';
import { Truck } from 'lucide-react';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { useHeavyQuote } from '@/modules/calculator/engine/useHeavyQuote';
import { CostBreakdown } from '../towing/CostBreakdown';
import { NotePreview } from '../towing/NotePreview';

export const HeavyTowingForm = () => {
    const { benefits, loading: loadingBenefits } = useBenefits('heavy');
    const { tolls } = useTolls();
    const { rate: exchangeRate, isFallback } = useExchangeRate();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [ps, setPs] = useState('');
    const [sd, setSd] = useState('');
    const [maniobra, setManiobra] = useState('');
    const [selectedTolls, setSelectedTolls] = useState<string[]>([]);

    const { quote } = useHeavyQuote(
        Number(ps),
        Number(sd),
        Number(maniobra),
        selectedTolls,
        tolls,
        selectedBenefit,
        exchangeRate
    );

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.plan_name} (${b.partner_name})`
    }));

    const handlePartnerChange = (id: string) => {
        const found = benefits.find(b => b.id === id);
        if (found) setSelectedBenefit(found);
    };

    const toggleToll = (tollId: string) => {
        setSelectedTolls(prev =>
            prev.includes(tollId) ? prev.filter(t => t !== tollId) : [...prev, tollId]
        );
    };

    const selectedTollsNames = tolls
        .filter(t => selectedTolls.includes(t.id))
        .map(t => `${t.name} (₡${t.prices.heavy || t.prices.tow})`);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="xl:col-span-2 space-y-8">
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Truck size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Datos Grúa Pesada</h3>
                    </div>

                    <SearchableSelect
                        label="Socio y Plan (Pesado)"
                        placeholder={loadingBenefits ? "Cargando planes..." : "Seleccione el plan..."}
                        options={partnerOptions}
                        value={selectedBenefit?.id || ''}
                        onChange={handlePartnerChange}
                    />

                    {selectedBenefit && (
                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-600 dark:text-purple-300 flex items-center gap-2">
                            <Truck size={14} />
                            <span>
                                Plan: <strong>{selectedBenefit.plan_name}</strong> |
                                Cobertura: {
                                    selectedBenefit.currency
                                        ? ` ${(selectedBenefit.limit_value || 0).toLocaleString('es-CR')} ${selectedBenefit.currency}`
                                        : ` ${(selectedBenefit.limit_value || 0)} KM`
                                }
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 max-w-md">
                        <LabeledInput label="PS (Proveedor al Cliente)" suffix="KM" type="number" value={ps} onChange={(e) => setPs(e.target.value)} />
                        <LabeledInput label="SD (Recojo al Destino)" suffix="KM" type="number" value={sd} onChange={(e) => setSd(e.target.value)} />
                        <LabeledInput label="Costo de Maniobra" suffix="CRC" type="number" value={maniobra} onChange={(e) => setManiobra(e.target.value)} />
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Peajes (Tarifa Pesada)</h3>
                        <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full font-bold">
                            {selectedTolls.length} SELECCIONADOS
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {tolls.map(toll => (
                            <CheckboxChip
                                key={toll.id}
                                label={`${toll.name} (₡${toll.prices.heavy || toll.prices.tow})`}
                                isActive={selectedTolls.includes(toll.id)}
                                onToggle={() => toggleToll(toll.id)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            <div className="xl:col-span-1 space-y-6 sticky top-8 h-fit">
                <CostBreakdown quote={quote} isFallback={isFallback} />

                <NotePreview
                    partnerName={selectedBenefit?.partner_name || ''}
                    planName={selectedBenefit?.plan_name || '...'}
                    ps={ps}
                    sd={sd}
                    maneuver={maniobra}
                    totalKm={Number(ps) + Number(sd)}
                    tollsList={selectedTollsNames}
                    calculatedAmount={quote.finalTotal}
                />
            </div>
        </div>
    );
};