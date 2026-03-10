import { useState, useEffect } from 'react';
import { LabeledInput } from '@/shared/ui/forms/LabeledInput';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { TollSelector } from '@/shared/ui/forms/TollSelector';
import { ClearFieldsButton } from '@/shared/ui/ClearFieldsButton';
import { useBenefits, type Benefit } from '@/shared/hooks/useBenefits';
import { useTolls } from '@/shared/hooks/useTolls';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { useTowingQuote } from '@/modules/calculator/engine/useTowingQuote';

interface SimpleTransferFormProps {
    onMessageChange: (message: string) => void;
}

export const SimpleTransferForm = ({ onMessageChange }: SimpleTransferFormProps) => {
    const { benefits, loading: loadingBenefits } = useBenefits('towing');
    const { tolls, loading: loadingTolls } = useTolls();
    const { rate: exchangeRate } = useExchangeRate();

    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

    // Datos Texto
    const [placa, setPlaca] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [ubicado, setUbicado] = useState('');
    const [destino, setDestino] = useState('');
    const [ruta, setRuta] = useState('');
    const [averia, setAveria] = useState('');
    const [solicita, setSolicita] = useState('');
    const [telefono, setTelefono] = useState('');

    // Datos Numéricos y Detalles
    const [ps, setPs] = useState('');
    const [sd, setSd] = useState('');
    const [selectedTolls, setSelectedTolls] = useState<string[]>([]);
    const [maniobraMonto, setManiobraMonto] = useState('');
    const [maniobraDetalle, setManiobraDetalle] = useState('');
    const [ferryMonto, setFerryMonto] = useState('');

    const handleReset = () => {
        setSelectedBenefit(null);
        setPlaca(''); setMarca(''); setModelo(''); setUbicado(''); setDestino('');
        setRuta(''); setAveria(''); setSolicita(''); setTelefono('');
        setPs(''); setSd(''); setSelectedTolls([]);
        setManiobraMonto(''); setManiobraDetalle(''); setFerryMonto('');
    };

    const toggleToll = (tollId: string) => {
        setSelectedTolls(prev =>
            prev.includes(tollId) ? prev.filter(t => t !== tollId) : [...prev, tollId]
        );
    };

    const totalExtrasManuales = Number(maniobraMonto) + Number(ferryMonto);

    const { quote } = useTowingQuote(
        Number(sd),
        totalExtrasManuales,
        selectedTolls,
        tolls,
        selectedBenefit,
        exchangeRate
    );

    const partnerOptions = benefits.map(b => ({
        id: b.id,
        label: `${b.partner_name} - ${b.plan_name}`
    }));

    useEffect(() => {
        const fmt = (n: number) => n.toLocaleString('es-CR');
        const val = (text: string) => text.trim() ? text.trim() : 'NO APLICA';

        const selectedTollsData = tolls.filter(t => selectedTolls.includes(t.id));
        const tollCost = selectedTollsData.reduce((acc, t) => acc + t.prices.tow, 0);
        const tollNames = selectedTollsData.map(t => t.name).join(', ');
        const peajesTexto = tollCost > 0 ? `₡${fmt(tollCost)} (${tollNames})` : 'NO APLICA';

        const ferryTexto = Number(ferryMonto) > 0 ? `₡${fmt(Number(ferryMonto))}` : 'NO APLICA';
        const maniobraTexto = Number(maniobraMonto) > 0
            ? `₡${fmt(Number(maniobraMonto))}${maniobraDetalle.trim() ? ` (${maniobraDetalle.trim()})` : ''}`
            : 'NO APLICA';

        let maxBenefit = 0;
        if (selectedBenefit) {
            maxBenefit = selectedBenefit.currency === 'USD'
                ? (selectedBenefit.limit_value || 0) * exchangeRate
                : (selectedBenefit.limit_value || 0);
        }

        const message = `Buen día estimados para informarles que tenemos asistencia de grúa:

Placa: ${val(placa).toUpperCase()}
Marca: ${val(marca)}
Modelo: ${val(modelo)}
Ubicado: ${val(ubicado)}
Destino: ${val(destino)}

Ferry: ${ferryTexto}
Peajes: ${peajesTexto}
Maniobra: ${maniobraTexto}
Costo total del servicio (sin impuesto al valor agregado): ₡${fmt(quote.serviceSubtotal)}
Beneficio: ₡${fmt(maxBenefit)}
Excedente (sin impuesto al valor agregado): ₡${fmt(quote.clientExcedente)}

Ruta: ${val(ruta)}
Avería: ${val(averia)}
Solicita: ${val(solicita)}
Teléfono: ${val(telefono)}

Quedo atento al visto bueno para proceder. Gracias`;

        onMessageChange(message.trim());
    }, [
        placa, marca, modelo, ubicado, destino,
        ruta, averia, solicita, telefono,
        ps, sd, selectedTolls, tolls, maniobraMonto, maniobraDetalle, ferryMonto,
        quote, selectedBenefit, exchangeRate, onMessageChange
    ]);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">

            <section>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        1. Datos de Contacto y Vehículo
                    </h3>
                    <ClearFieldsButton onClear={handleReset} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LabeledInput label="Placa" placeholder="Ej: ABC-123" value={placa} onChange={e => setPlaca(e.target.value)} />
                    <LabeledInput label="Marca" placeholder="Ej: Toyota" value={marca} onChange={e => setMarca(e.target.value)} />
                    <LabeledInput label="Modelo" placeholder="Ej: Hilux 2020" value={modelo} onChange={e => setModelo(e.target.value)} />
                    <LabeledInput label="Avería" placeholder="Ej: Falla Mecánica" value={averia} onChange={e => setAveria(e.target.value)} />
                    <LabeledInput label="Solicita (Nombre)" placeholder="Ej: Juan Pérez" value={solicita} onChange={e => setSolicita(e.target.value)} />
                    <LabeledInput label="Teléfono" placeholder="Ej: 8888-8888" value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    2. Detalles de la Ruta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput label="Ubicado (Origen)" placeholder="¿Dónde está?" value={ubicado} onChange={e => setUbicado(e.target.value)} />
                    <LabeledInput label="Destino" placeholder="¿Hacia dónde va?" value={destino} onChange={e => setDestino(e.target.value)} />
                    <div className="md:col-span-2">
                        <LabeledInput label="Ruta (Vía)" placeholder="Ej: Por Ruta 27" value={ruta} onChange={e => setRuta(e.target.value)} />
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900/50 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                    3. Costos y Cálculo Financiero
                </h3>

                <SearchableSelect
                    label="Socio y Plan"
                    placeholder={loadingBenefits ? "Cargando..." : "Seleccione el plan..."}
                    options={partnerOptions}
                    value={selectedBenefit?.id || ''}
                    onChange={(id) => setSelectedBenefit(benefits.find(b => b.id === id) || null)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledInput label="PS" suffix="KM" type="number" placeholder="0" value={ps} onChange={(e) => setPs(e.target.value)} />
                    <LabeledInput label="SD" suffix="KM" type="number" placeholder="0" value={sd} onChange={(e) => setSd(e.target.value)} />
                    <LabeledInput label="Ferry (Monto Manual)" suffix="CRC" type="number" placeholder="0" value={ferryMonto} onChange={(e) => setFerryMonto(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput label="Maniobra (Monto Manual)" suffix="CRC" type="number" placeholder="0" value={maniobraMonto} onChange={(e) => setManiobraMonto(e.target.value)} />
                    <LabeledInput label="Maniobra (Detalle)" placeholder="Ej: Extracción de guindo" value={maniobraDetalle} onChange={(e) => setManiobraDetalle(e.target.value)} />
                </div>

                {!loadingTolls && (
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 mt-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selección de Peajes</p>
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                                {selectedTolls.length} SELECCIONADOS
                            </span>
                        </div>
                        <div className="pt-2">
                            <TollSelector tolls={tolls} selectedTolls={selectedTolls} onToggle={toggleToll} type="tow" />
                        </div>
                    </div>
                )}
            </section>

        </div>
    );
};