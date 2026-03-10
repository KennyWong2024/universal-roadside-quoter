import { useState, useEffect } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { TollSelector } from '@/shared/ui/forms/TollSelector';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { useTowingQuote } from '@/modules/calculator/engine/useTowingQuote';
import { ArrowLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VehicleSwapFormProps {
    onMessageChange: (message: string) => void;
}

export const VehicleSwapForm = ({ onMessageChange }: VehicleSwapFormProps) => {
    const { benefits, loading: loadingBenefits } = useBenefits('towing');
    const { tolls, loading: loadingTolls } = useTolls();
    const { rate: exchangeRate } = useExchangeRate();

    const [activeTab, setActiveTab] = useState<'bueno' | 'malo'>('bueno');

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
    const [solicita, setSolicita] = useState('');
    const [telefono, setTelefono] = useState('');

    const initBueno = { placa: '', marca: '', modelo: '', ubicado: '', destino: '', ruta: '', ps: '', sd: '', ferryMonto: '', tolls: [] as string[] };
    const initMalo = { placa: '', marca: '', modelo: '', averia: '', ubicado: '', destino: '', ruta: '', ps: '', sd: '', maniobraMonto: '', maniobraDetalle: '', ferryMonto: '', tolls: [] as string[] };

    const [bueno, setBueno] = useState(initBueno);
    const [malo, setMalo] = useState(initMalo);

    const handleReset = () => {
        setSelectedBenefit(null);
        setSolicita(''); setTelefono('');
        setBueno(initBueno);
        setMalo(initMalo);
        setActiveTab('bueno');
    };

    const { quote: quoteBueno } = useTowingQuote(
        Number(bueno.sd), Number(bueno.ferryMonto), bueno.tolls, tolls, null, exchangeRate
    );

    const { quote: quoteMalo } = useTowingQuote(
        Number(malo.sd), Number(malo.ferryMonto) + Number(malo.maniobraMonto), malo.tolls, tolls, selectedBenefit, exchangeRate
    );

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name}`
    }));

    const handleInvertRoute = () => {
        setMalo(prev => ({
            ...prev,
            ubicado: bueno.destino,
            destino: bueno.ubicado,
            ruta: bueno.ruta,
            ps: bueno.ps,
            sd: bueno.sd,
            tolls: [...bueno.tolls]
        }));
        setActiveTab('malo');
    };

    useEffect(() => {
        const fmt = (n: number) => n.toLocaleString('es-CR');
        const val = (text: string) => text.trim() ? text.trim() : 'NO APLICA';

        const calcTolls = (selectedIds: string[]) => {
            const data = tolls.filter(t => selectedIds.includes(t.id));
            const cost = data.reduce((acc, t) => acc + t.prices.tow, 0);
            return { cost, text: cost > 0 ? `₡${fmt(cost)} (${data.map(t => t.name).join(', ')})` : 'NO APLICA' };
        };

        const tollsBueno = calcTolls(bueno.tolls);
        const tollsMalo = calcTolls(malo.tolls);

        const ferryBuenoTxt = Number(bueno.ferryMonto) > 0 ? `₡${fmt(Number(bueno.ferryMonto))}` : 'NO APLICA';
        const ferryMaloTxt = Number(malo.ferryMonto) > 0 ? `₡${fmt(Number(malo.ferryMonto))}` : 'NO APLICA';

        const maniobraMaloTxt = Number(malo.maniobraMonto) > 0
            ? `₡${fmt(Number(malo.maniobraMonto))}${malo.maniobraDetalle.trim() ? ` (${malo.maniobraDetalle.trim()})` : ''}`
            : 'NO APLICA';

        let maxBenefit = 0;
        if (selectedBenefit) {
            maxBenefit = selectedBenefit.currency === 'USD'
                ? (selectedBenefit.limit_value || 0) * exchangeRate
                : (selectedBenefit.limit_value || 0);
        }

        const message = `Buen día estimados para informarles que tenemos asistencia de cambio de vehículo:

*Vehículo bueno:*

Placa: ${val(bueno.placa).toUpperCase()}
Marca: ${val(bueno.marca)}
Modelo: ${val(bueno.modelo)}
Ubicado: ${val(bueno.ubicado)}
Destino: ${val(bueno.destino)}

Ferry: ${ferryBuenoTxt}
Peajes: ${tollsBueno.text}
Costo total del servicio (sin impuesto al valor agregado): ₡${fmt(quoteBueno.serviceSubtotal)}
Beneficio: ₡0
Excedente (sin impuesto al valor agregado): ₡${fmt(quoteBueno.clientExcedente)}

Ruta: ${val(bueno.ruta)}
Avería: Vehículo Bueno

*Vehículo malo:*

Placa: ${val(malo.placa).toUpperCase()}
Marca: ${val(malo.marca)}
Modelo: ${val(malo.modelo)}
Ubicado: ${val(malo.ubicado)}
Destino: ${val(malo.destino)}

Ferry: ${ferryMaloTxt}
Peajes: ${tollsMalo.text}
Maniobra: ${maniobraMaloTxt}
Costo total del servicio (sin impuesto al valor agregado): ₡${fmt(quoteMalo.serviceSubtotal)}
Beneficio: ₡${fmt(maxBenefit)}
Excedente (sin impuesto al valor agregado): ₡${fmt(quoteMalo.clientExcedente)}

Ruta: ${val(malo.ruta)}
Avería: ${val(malo.averia)}
Solicita: ${val(solicita)}
Teléfono: ${val(telefono)}

Quedo atento al visto bueno para proceder. Gracias`;

        onMessageChange(message.trim());
    }, [
        bueno, malo, solicita, telefono, quoteBueno, quoteMalo,
        tolls, selectedBenefit, exchangeRate, onMessageChange
    ]);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">

            {/* 1. DATOS GENERALES */}
            <section className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Datos Generales</h3>
                    <ClearFieldsButton onClear={handleReset} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                        <SearchableSelect
                            label="Socio y Plan (Aplica al Vehículo Malo)"
                            placeholder={loadingBenefits ? "Cargando..." : "Seleccione el plan..."}
                            options={partnerOptions}
                            value={selectedBenefit?.id || ''}
                            onChange={(id) => setSelectedBenefit(benefits.find(b => b.id === id) || null)}
                        />
                    </div>
                    <LabeledInput label="Solicita (Nombre Cliente)" placeholder="Ej: Juan Pérez" value={solicita} onChange={e => setSolicita(e.target.value)} />
                    <LabeledInput label="Teléfono Cliente" placeholder="Ej: 8888-8888" value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>
            </section>

            {/* 2. PESTAÑAS DE VEHÍCULOS */}
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button onClick={() => setActiveTab('bueno')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'bueno' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <CheckCircle2 size={18} /> 1. Vehículo Bueno (Sale)
                </button>
                <button onClick={() => setActiveTab('malo')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'malo' ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <AlertTriangle size={18} /> 2. Vehículo Malo (Regresa)
                </button>
            </div>

            {/* --- CONTENIDO VEHÍCULO BUENO --- */}
            <div className={activeTab === 'bueno' ? 'block space-y-6 animate-in fade-in' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledInput label="Placa" placeholder="Ej: RENT-001" value={bueno.placa} onChange={e => setBueno({ ...bueno, placa: e.target.value })} />
                    <LabeledInput label="Marca" placeholder="Ej: Toyota" value={bueno.marca} onChange={e => setBueno({ ...bueno, marca: e.target.value })} />
                    <LabeledInput label="Modelo" placeholder="Ej: Yaris 2024" value={bueno.modelo} onChange={e => setBueno({ ...bueno, modelo: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput label="Ubicado (Origen)" placeholder="Ej: Base Rent a Car, San José" value={bueno.ubicado} onChange={e => setBueno({ ...bueno, ubicado: e.target.value })} />
                    <LabeledInput label="Destino" placeholder="Ej: Hotel Jacó" value={bueno.destino} onChange={e => setBueno({ ...bueno, destino: e.target.value })} />
                    <div className="md:col-span-2">
                        <LabeledInput label="Ruta (Vía)" placeholder="Ej: Ruta 27" value={bueno.ruta} onChange={e => setBueno({ ...bueno, ruta: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <LabeledInput label="PS" suffix="KM" type="number" placeholder="0" value={bueno.ps} onChange={e => setBueno({ ...bueno, ps: e.target.value })} />
                    <LabeledInput label="SD" suffix="KM" type="number" placeholder="0" value={bueno.sd} onChange={e => setBueno({ ...bueno, sd: e.target.value })} />
                    <LabeledInput label="Ferry (Monto)" suffix="CRC" type="number" placeholder="0" value={bueno.ferryMonto} onChange={e => setBueno({ ...bueno, ferryMonto: e.target.value })} />
                </div>

                {!loadingTolls && (
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 shadow-sm">
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-3">Peajes Vehículo Bueno</p>
                        <TollSelector tolls={tolls} selectedTolls={bueno.tolls} type="tow"
                            onToggle={(id) => setBueno({ ...bueno, tolls: bueno.tolls.includes(id) ? bueno.tolls.filter(t => t !== id) : [...bueno.tolls, id] })}
                        />
                    </div>
                )}
            </div>

            {/* --- CONTENIDO VEHÍCULO MALO --- */}
            <div className={activeTab === 'malo' ? 'block space-y-6 animate-in fade-in' : 'hidden'}>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">¿La ruta es un espejo?</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Autocompleta Origen, Destino, KM y Peajes invirtiendo los datos del Vehículo Bueno.</p>
                    </div>
                    <button onClick={handleInvertRoute} className="flex items-center justify-center w-full md:w-auto gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all">
                        <ArrowLeftRight size={16} /> INVERTIR DATOS
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <LabeledInput label="Placa" placeholder="Ej: XYZ-123" value={malo.placa} onChange={e => setMalo({ ...malo, placa: e.target.value })} />
                    <LabeledInput label="Marca" placeholder="Ej: Toyota" value={malo.marca} onChange={e => setMalo({ ...malo, marca: e.target.value })} />
                    <LabeledInput label="Modelo" placeholder="Ej: Yaris 2022" value={malo.modelo} onChange={e => setMalo({ ...malo, modelo: e.target.value })} />
                    <LabeledInput label="Avería" placeholder="Ej: Accidente" value={malo.averia} onChange={e => setMalo({ ...malo, averia: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput label="Ubicado (Origen)" placeholder="Ej: Hotel Jacó" value={malo.ubicado} onChange={e => setMalo({ ...malo, ubicado: e.target.value })} />
                    <LabeledInput label="Destino" placeholder="Ej: Base Rent a Car, San José" value={malo.destino} onChange={e => setMalo({ ...malo, destino: e.target.value })} />
                    <div className="md:col-span-2">
                        <LabeledInput label="Ruta (Vía)" placeholder="Ej: Ruta 27" value={malo.ruta} onChange={e => setMalo({ ...malo, ruta: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <LabeledInput label="PS" suffix="KM" type="number" placeholder="0" value={malo.ps} onChange={e => setMalo({ ...malo, ps: e.target.value })} />
                    <LabeledInput label="SD" suffix="KM" type="number" placeholder="0" value={malo.sd} onChange={e => setMalo({ ...malo, sd: e.target.value })} />
                    <LabeledInput label="Ferry (Monto)" suffix="CRC" type="number" placeholder="0" value={malo.ferryMonto} onChange={e => setMalo({ ...malo, ferryMonto: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput label="Maniobra (Monto)" suffix="CRC" type="number" placeholder="0" value={malo.maniobraMonto} onChange={e => setMalo({ ...malo, maniobraMonto: e.target.value })} />
                    <LabeledInput label="Maniobra (Detalle)" placeholder="Ej: Extracción" value={malo.maniobraDetalle} onChange={e => setMalo({ ...malo, maniobraDetalle: e.target.value })} />
                </div>

                {!loadingTolls && (
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm">
                        <p className="text-xs font-bold text-red-500 uppercase mb-3">Peajes Vehículo Malo</p>
                        <TollSelector tolls={tolls} selectedTolls={malo.tolls} type="tow"
                            onToggle={(id) => setMalo({ ...malo, tolls: malo.tolls.includes(id) ? malo.tolls.filter(t => t !== id) : [...malo.tolls, id] })}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};