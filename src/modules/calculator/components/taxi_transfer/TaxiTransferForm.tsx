import { useState } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { CarFront, Users, AlertCircle } from 'lucide-react';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { TollSelector } from '@/shared/ui/forms/TollSelector';
import { useCalculatorStore } from '@/modules/calculator/store/calculator.store';
import { useTaxiQuote } from '../../engine/useTaxiQuote';
import { TaxiCostBreakdown } from './TaxiCostBreakdown';
import { TaxiNotePreview } from './TaxiNotePreview';
import { FloatingTaxiNote } from './FloatingTaxiNote';

export const TaxiTransferForm = () => {
    const { isFloating } = useCalculatorStore();

    const { benefits, loading: loadingBenefits } = useBenefits('taxi');
    const { tolls, loading: loadingTolls } = useTolls();
    const { rate: exchangeRate, isFallback } = useExchangeRate();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [ps, setPs] = useState('');
    const [sd, setSd] = useState('');
    const [vehicleType, setVehicleType] = useState<'light' | 'microbus'>('light');
    const [selectedTolls, setSelectedTolls] = useState<string[]>([]);

    const handleReset = () => {
        setSelectedBenefit(null);
        setPs('');
        setSd('');
        setVehicleType('light');
        setSelectedTolls([]);
    };

    const { calculation } = useTaxiQuote(
        ps,
        sd,
        vehicleType,
        selectedTolls,
        tolls,
        selectedBenefit,
        exchangeRate
    );

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name} (${b.currency} ${b.limit_value?.toLocaleString()})`
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

    const isReadyToQuote = calculation !== null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="xl:col-span-2 space-y-8">
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400">
                            <CarFront size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Datos Traslado (Taxi)</h3>
                        </div>

                        <ClearFieldsButton onClear={handleReset} />
                    </div>

                    <SearchableSelect
                        label="Socio y Plan (Beneficio)"
                        placeholder={loadingBenefits ? "Cargando beneficios..." : "Seleccione el plan..."}
                        options={partnerOptions}
                        value={selectedBenefit?.id || ''}
                        onChange={handlePartnerChange}
                    />

                    <div className="max-w-md">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Tipo de Vehículo Solicitado</label>
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50">
                            <button
                                onClick={() => setVehicleType('light')}
                                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${vehicleType === 'light'
                                    ? 'bg-white dark:bg-slate-700 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <CarFront size={18} /> Automóvil (Sedán)
                            </button>
                            <button
                                onClick={() => setVehicleType('microbus')}
                                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${vehicleType === 'microbus'
                                    ? 'bg-white dark:bg-slate-700 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Users size={18} /> Buseta (Microbús)
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 max-w-md pt-2">
                        <LabeledInput label="PS (Proveedor al Cliente)" suffix="KM" type="number" value={ps} onChange={(e) => setPs(e.target.value)} />
                        <LabeledInput label="SD (Recojo al Destino)" suffix="KM" type="number" value={sd} onChange={(e) => setSd(e.target.value)} />
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selección de Peajes</h3>
                        <span className="text-[10px] bg-fuchsia-500/10 text-fuchsia-600 px-2 py-1 rounded-full font-bold">
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
                            type={vehicleType}
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
                            <FloatingTaxiNote
                                partnerName={selectedBenefit?.partner_name || ''}
                                planName={selectedBenefit?.plan_name || ''}
                                vehicleType={vehicleType}
                                calculation={calculation}
                            />
                        ) : (
                            <>
                                <TaxiCostBreakdown calculation={calculation} isFallback={isFallback} />
                                <TaxiNotePreview
                                    partnerName={selectedBenefit?.partner_name || ''}
                                    planName={selectedBenefit?.plan_name || ''}
                                    vehicleType={vehicleType}
                                    calculation={calculation}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};