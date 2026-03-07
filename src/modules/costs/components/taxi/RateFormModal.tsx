import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, MapPin, AlertCircle } from 'lucide-react';
import { type TaxiRate } from '../../hooks/useAirportRates';

interface RateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (rate: any) => Promise<boolean>;
    existingRates: TaxiRate[];
    initialData?: TaxiRate | null;
}

export const RateFormModal = ({ isOpen, onClose, onSave, existingRates, initialData }: RateFormModalProps) => {
    const [province, setProvince] = useState('');
    const [canton, setCanton] = useState('');
    const [district, setDistrict] = useState('');
    const [price, setPrice] = useState<string>('');
    const [airport, setAirport] = useState('SJO');
    const isEditing = !!initialData;

    const provinceSuggestions = useMemo(() =>
        Array.from(new Set(existingRates.map(r => r.location.province))).sort()
        , [existingRates]);

    const cantonSuggestions = useMemo(() =>
        Array.from(new Set(existingRates
            .filter(r => r.location.province === province)
            .map(r => r.location.canton)
        )).sort()
        , [existingRates, province]);

    const districtSuggestions = useMemo(() =>
        Array.from(new Set(existingRates
            .filter(r => r.location.canton === canton)
            .map(r => r.location.district)
        )).sort()
        , [existingRates, canton]);

    useEffect(() => {
        if (initialData) {
            setProvince(initialData.location.province);
            setCanton(initialData.location.canton);
            setDistrict(initialData.location.district);
            setPrice(initialData.price.toString());
            setAirport(initialData.airport_id);
        } else {
            setProvince(''); setCanton(''); setDistrict(''); setPrice(''); setAirport('SJO');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const ratePayload: any = {
            active: true,
            airport_id: airport,
            country: 'CR',
            currency: 'CRC',
            price: Number(price),
            location: {
                province: province.trim(),
                canton: canton.trim(),
                district: district.trim()
            }
        };

        if (isEditing) {
            ratePayload.id = initialData.id;
        }

        const success = await onSave(ratePayload);
        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <MapPin size={18} className="text-blue-500" />
                                {isEditing ? 'Actualizar Tarifa' : 'Nueva Ruta'}
                            </h3>
                            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {isEditing && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-xl flex items-start gap-3 text-xs mb-2 border border-blue-100 dark:border-blue-800/50">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>
                                        <strong>Modo Edición:</strong> Para mantener la integridad de la base de datos, solo puedes actualizar el monto de la tarifa. Si hay un error en la ubicación, elimina esta ruta y crea una nueva.
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400">Aeropuerto Origen</label>
                                <select
                                    disabled={isEditing}
                                    className={`w-full mt-1 p-2 rounded-lg border outline-none transition-colors
                                        ${isEditing
                                            ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                                    value={airport} onChange={e => setAirport(e.target.value)}>
                                    <option value="SJO">Juan Santamaría (SJO)</option>
                                    <option value="LIR">Daniel Oduber (LIR)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Provincia</label>
                                    <input
                                        disabled={isEditing}
                                        required list="provinces-list"
                                        className={`w-full mt-1 p-2 rounded-lg border outline-none transition-colors
                                            ${isEditing
                                                ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                                        placeholder="Ej: San José"
                                        value={province} onChange={e => setProvince(e.target.value)}
                                    />
                                    <datalist id="provinces-list">
                                        {provinceSuggestions.map(p => <option key={p} value={p} />)}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Cantón</label>
                                    <input
                                        disabled={isEditing}
                                        required list="cantons-list"
                                        className={`w-full mt-1 p-2 rounded-lg border outline-none transition-colors
                                            ${isEditing
                                                ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                                        placeholder="Ej: Escazú"
                                        value={canton} onChange={e => setCanton(e.target.value)}
                                    />
                                    <datalist id="cantons-list">
                                        {cantonSuggestions.map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400">Distrito (Destino Final)</label>
                                <input
                                    disabled={isEditing}
                                    required list="districts-list"
                                    className={`w-full mt-1 p-2 rounded-lg border outline-none transition-colors
                                        ${isEditing
                                            ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                                    placeholder="Ej: San Antonio"
                                    value={district} onChange={e => setDistrict(e.target.value)}
                                />
                                <datalist id="districts-list">
                                    {districtSuggestions.map(d => <option key={d} value={d} />)}
                                </datalist>
                            </div>

                            <div className="pt-2">
                                <label className="text-[10px] font-bold uppercase text-blue-500 dark:text-blue-400">Tarifa Estimada (CRC)</label>
                                <input
                                    required type="number" min="0" step="1"
                                    className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-500 outline-none font-bold text-lg focus:ring-4 focus:ring-blue-500/20 transition-all"
                                    value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 mt-4 flex justify-center gap-2 transition-transform active:scale-95">
                                <Save size={18} /> {isEditing ? 'ACTUALIZAR TARIFA' : 'GUARDAR RUTA'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};