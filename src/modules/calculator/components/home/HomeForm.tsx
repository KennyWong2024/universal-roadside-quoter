import { Home, AlertCircle, Moon } from 'lucide-react';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { useCalculatorStore } from '@/modules/calculator/store/calculator.store';
import { useHomeQuote } from '../../engine/useHomeQuote';
import { HomeCostBreakdown } from './HomeCostBreakdown';
import { HomeNotePreview } from './HomeNotePreview';
import { FloatingHomeNote } from './FloatingHomeNote';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';

export const HomeForm = () => {
    const { isFloating } = useCalculatorStore();
    const { isFallback } = useExchangeRate();
    const {
        benefits, hourlyRates, mileageRanges, loading,
        selectedBenefit, setSelectedBenefit,
        selectedHoursId, setSelectedHoursId,
        selectedMileageId, setSelectedMileageId,
        materialCost, setMaterialCost,
        isNightShift, setIsNightShift,
        selectedHourOption, selectedMileageOption,
        calculation, generateNote
    } = useHomeQuote();

    const handleReset = () => {
        setSelectedBenefit(null);
        setSelectedHoursId('');
        setSelectedMileageId('');
        setMaterialCost('');
        setIsNightShift(false);
    };

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name} (${b.currency} ${b.limit_value?.toLocaleString()})`
    }));

    const hoursOptions = hourlyRates.map(h => ({ id: h.id, label: h.label }));
    const mileageOptions = mileageRanges.map(m => ({ id: m.id, label: m.label }));

    const isReadyToQuote = calculation !== null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="xl:col-span-2 space-y-8">
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Home size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Datos Asistencia Hogar</h3>
                        </div>
                        <ClearFieldsButton onClear={handleReset} />
                    </div>

                    <div className="space-y-6">
                        <SearchableSelect
                            label="Aseguradora (Socio)"
                            placeholder={loading ? "Sincronizando..." : "Seleccione el plan..."}
                            options={partnerOptions}
                            value={selectedBenefit?.id || ''}
                            onChange={(id) => {
                                const found = benefits.find(b => b.id === id);
                                setSelectedBenefit(found || null);
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchableSelect
                                label="Tiempo de Trabajo Estimado"
                                placeholder={loading ? "Calculando..." : "Seleccionar horas..."}
                                options={hoursOptions}
                                value={selectedHoursId}
                                onChange={setSelectedHoursId}
                            />

                            <SearchableSelect
                                label="Kilometraje Adicional"
                                placeholder={loading ? "Calculando..." : "Seleccionar distancia..."}
                                options={mileageOptions}
                                value={selectedMileageId}
                                onChange={setSelectedMileageId}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LabeledInput
                                label="Monto por Materiales"
                                suffix="CRC"
                                type="number"
                                value={materialCost}
                                onChange={(e) => setMaterialCost(e.target.value)}
                            />

                            <div className="flex flex-col justify-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isNightShift}
                                            onChange={(e) => setIsNightShift(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 select-none">
                                        <Moon size={16} className={isNightShift ? "text-emerald-500" : "text-slate-400"} />
                                        Aplicar Horario Nocturno
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
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
                            <FloatingHomeNote
                                generateNote={generateNote}
                                totalAmount={calculation.grandTotal}
                            />
                        ) : (
                            <>
                                <HomeCostBreakdown calculation={calculation} isFallback={isFallback} />
                                <HomeNotePreview
                                    selectedBenefit={selectedBenefit}
                                    calculation={calculation}
                                    hoursLabel={selectedHourOption?.label || ''}
                                    mileageLabel={selectedMileageOption?.label || ''}
                                    isNightShift={isNightShift}
                                    generateNote={generateNote}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};