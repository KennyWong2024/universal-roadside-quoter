import { useState, useEffect } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { TollSelector } from '@/shared/ui/forms/TollSelector';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { useTaxiQuote } from '@/modules/calculator/engine/useTaxiQuote';
import { CarFront, Users } from 'lucide-react';

interface TaxiReportFormProps {
    onMessageChange: (message: string) => void;
}

export const TaxiReportForm = ({ onMessageChange }: TaxiReportFormProps) => {
    const { benefits, loading: loadingBenefits } = useBenefits('taxi');
    const { tolls, loading: loadingTolls } = useTolls();
    const { rate: exchangeRate } = useExchangeRate();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [placa, setPlaca] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [ubicado, setUbicado] = useState('');
    const [destino, setDestino] = useState('');
    const [ruta, setRuta] = useState('');
    const [averia, setAveria] = useState('');
    const [solicita, setSolicita] = useState('');
    const [telefono, setTelefono] = useState('');

    const [ps, setPs] = useState('');
    const [sd, setSd] = useState('');
    const [vehicleType, setVehicleType] = useState<'light' | 'microbus'>('light');
    const [selectedTolls, setSelectedTolls] = useState<string[]>([]);

    const handleReset = () => {
        setSelectedBenefit(null);
        setPlaca(''); setMarca(''); setModelo(''); setUbicado(''); setDestino('');
        setRuta(''); setAveria(''); setSolicita(''); setTelefono('');
        setPs(''); setSd(''); setVehicleType('light'); setSelectedTolls([]);
    };

    const { calculation } = useTaxiQuote(ps, sd, vehicleType, selectedTolls, tolls, selectedBenefit, exchangeRate);

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name}`
    }));

    useEffect(() => {
        if (!calculation) return;
        const fmt = (n: number) => n.toLocaleString('es-CR');
        const val = (text: string) => text.trim() ? text.trim() : 'NO APLICA';
        const autoLabel = vehicleType === 'light' ? 'AUTOMOVIL' : 'BUSETA';

        const selectedTollsData = tolls.filter(t => selectedTolls.includes(t.id));
        const tollCost = selectedTollsData.reduce((acc, t) => acc + t.prices[vehicleType], 0);
        const peajesTexto = tollCost > 0 ? `₡${fmt(tollCost)} (${selectedTollsData.map(t => t.name).join(', ')})` : 'NO APLICA';

        let maxBenefit = 0;
        if (selectedBenefit) {
            maxBenefit = selectedBenefit.currency === 'USD' ? (selectedBenefit.limit_value || 0) * exchangeRate : (selectedBenefit.limit_value || 0);
        }

        const message = `Buen día estimados para informarles que tenemos asistencia de taxi:

Placa: ${val(placa).toUpperCase()}
Marca: ${val(marca)}
Modelo: ${val(modelo)}
Ubicado: ${val(ubicado)}
Destino: ${val(destino)}
Tipo de Auto: ${autoLabel}

Peajes: ${peajesTexto}
Costo (2 Puntos - Cliente): ₡${fmt(calculation.cost2Points)}
Costo (3 Puntos - Proveedor): ₡${fmt(calculation.cost3Points)}
Beneficio: ₡${fmt(maxBenefit)}
Excedente (sin IVA): ₡${fmt(calculation.excedentNet)}

Ruta: ${val(ruta)}
Avería: ${val(averia)}
Solicita: ${val(solicita)}
Teléfono: ${val(telefono)}

Quedo atento al visto bueno para proceder. Gracias`;

        onMessageChange(message.trim());
    }, [placa, marca, modelo, ubicado, destino, ruta, averia, solicita, telefono, calculation, vehicleType, selectedTolls, tolls, onMessageChange, selectedBenefit, exchangeRate]);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-fuchsia-600 uppercase tracking-widest">Datos de Contacto y Vehículo</h3>
                <ClearFieldsButton onClear={handleReset} />
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LabeledInput label="Placa" placeholder="Ej: TAX-123" value={placa} onChange={e => setPlaca(e.target.value)} />
                <LabeledInput label="Marca" placeholder="Ej: Toyota" value={marca} onChange={e => setMarca(e.target.value)} />
                <LabeledInput label="Modelo" placeholder="Ej: Yaris" value={modelo} onChange={e => setModelo(e.target.value)} />
                <LabeledInput label="Avería" placeholder="Ej: Accidente" value={averia} onChange={e => setAveria(e.target.value)} />
                <LabeledInput label="Solicita (Nombre)" placeholder="Ej: Juan Pérez" value={solicita} onChange={e => setSolicita(e.target.value)} />
                <LabeledInput label="Teléfono" placeholder="Ej: 8888-8888" value={telefono} onChange={e => setTelefono(e.target.value)} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledInput label="Ubicado (Origen)" placeholder="¿Dónde está?" value={ubicado} onChange={e => setUbicado(e.target.value)} />
                <LabeledInput label="Destino" placeholder="¿Hacia dónde va?" value={destino} onChange={e => setDestino(e.target.value)} />
                <div className="md:col-span-2">
                    <LabeledInput label="Ruta (Vía)" placeholder="Ej: Ruta 27" value={ruta} onChange={e => setRuta(e.target.value)} />
                </div>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <SearchableSelect
                    label="Socio y Plan"
                    placeholder={loadingBenefits ? "Cargando..." : "Seleccione el plan..."}
                    options={partnerOptions}
                    value={selectedBenefit?.id || ''}
                    onChange={(id) => setSelectedBenefit(benefits.find(b => b.id === id) || null)}
                />

                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-md">
                    <button onClick={() => setVehicleType('light')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${vehicleType === 'light' ? 'bg-white dark:bg-slate-700 text-fuchsia-600 shadow-sm' : 'text-slate-500'}`}><CarFront size={14} /> Automóvil</button>
                    <button onClick={() => setVehicleType('microbus')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${vehicleType === 'microbus' ? 'bg-white dark:bg-slate-700 text-fuchsia-600 shadow-sm' : 'text-slate-500'}`}><Users size={14} /> Buseta</button>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs">
                    <LabeledInput label="PS" suffix="KM" type="number" placeholder="0" value={ps} onChange={e => setPs(e.target.value)} />
                    <LabeledInput label="SD" suffix="KM" type="number" placeholder="0" value={sd} onChange={e => setSd(e.target.value)} />
                </div>

                {!loadingTolls && (
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Selección de Peajes</p>
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full font-bold">
                                {selectedTolls.length} SELECCIONADOS
                            </span>
                        </div>
                        <TollSelector tolls={tolls} selectedTolls={selectedTolls} onToggle={(id) => setSelectedTolls(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])} type={vehicleType} />
                    </div>
                )}
            </section>
        </div>
    );
};