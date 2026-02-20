import { useState } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { Car, Truck, AlertCircle } from 'lucide-react';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useTowingQuote } from '@/modules/calculator/engine/useTowingQuote';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { CostBreakdown } from './CostBreakdown';
import { NotePreview } from './NotePreview';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { TollSelector } from '@/shared/ui/forms/TollSelector';
import { useCalculatorStore } from '@/modules/calculator/store/calculator.store';
import { FloatingTowingNote } from './FloatingTowingNote';

export const TowingForm = () => {
    const { isFloating } = useCalculatorStore();

    const { benefits, loading: loadingBenefits } = useBenefits('towing');
    const { tolls, loading: loadingTolls } = useTolls();
    const { rate: exchangeRate, isFallback } = useExchangeRate();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [ps, setPs] = useState('');
    const [sd, setSd] = useState('');
    const [maniobra, setManiobra] = useState('');
    const [selectedTolls, setSelectedTolls] = useState<string[]>([]);

    const handleReset = () => {
        setSelectedBenefit(null);
        setPs('');
        setSd('');
        setManiobra('');
        setSelectedTolls([]);
    };

    const { quote } = useTowingQuote(
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
        .map(t => `${t.name} (₡${t.prices.tow})`);

    const isReadyToQuote = selectedBenefit !== null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="xl:col-span-2 space-y-8">
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Car size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Datos Grúa Liviana</h3>
                        </div>

                        <ClearFieldsButton onClear={handleReset} />
                    </div>

                    <SearchableSelect
                        label="Socio y Plan"
                        placeholder={loadingBenefits ? "Cargando..." : "Seleccione el plan..."}
                        options={partnerOptions}
                        value={selectedBenefit?.id || ''}
                        onChange={handlePartnerChange}
                    />

                    {selectedBenefit && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-300 flex items-center gap-2">
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
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selección de Peajes</h3>
                        <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full font-bold">
                            {selectedTolls.length} SELECCIONADOS
                        </span>
                    </div>

                    {loadingTolls ? (
                        <div className="text-xs text-slate-400 italic">Cargando matriz...</div>
                    ) : (
                        <TollSelector
                            tolls={tolls}
                            selectedTolls={selectedTolls}
                            onToggle={toggleToll}
                            type="tow"
                        />
                    )}
                </section>
            </div>

            <div className="xl:col-span-1 space-y-6 sticky top-8 h-fit">
                {!isReadyToQuote ? (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px] animate-in fade-in zoom-in-95">
                        <div className="w-12 h-12 bg-slate-200/50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                            Completa los datos para ver el desglose
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {isFloating ? (
                            <FloatingTowingNote
                                partnerName={selectedBenefit?.partner_name || ''}
                                planName={selectedBenefit?.plan_name || '...'}
                                ps={ps}
                                sd={sd}
                                maneuver={maniobra}
                                totalKm={Number(ps) + Number(sd)}
                                tollsList={selectedTollsNames}
                                calculatedAmount={quote.finalTotal}
                            />
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};