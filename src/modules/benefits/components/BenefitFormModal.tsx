import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ShieldCheck, Plane, Fuel, Gauge, Car, MapPin } from 'lucide-react';
import { type Benefit } from '../hooks/useBenefitsMatrix';

interface BenefitFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (benefit: any) => Promise<boolean>;
    initialData?: Benefit | null;
    defaultCategory?: string;
}

export const BenefitFormModal = ({ isOpen, onClose, onSave, initialData, defaultCategory = 'towing' }: BenefitFormModalProps) => {
    const [partnerName, setPartnerName] = useState('');
    const [planName, setPlanName] = useState('');
    const [serviceCategory, setServiceCategory] = useState(defaultCategory);
    const [benefitType, setBenefitType] = useState<'monetary_cap' | 'distance_cap' | 'fuel_liters'>('monetary_cap');
    const [limitValue, setLimitValue] = useState<string>('');
    const [currency, setCurrency] = useState<'CRC' | 'USD'>('CRC');
    const [applyAirportFee, setApplyAirportFee] = useState(true);
    const [fuelSuper, setFuelSuper] = useState('0');
    const [fuelRegular, setFuelRegular] = useState('0');
    const [fuelDiesel, setFuelDiesel] = useState('0');
    const [ccRange, setCcRange] = useState('all');
    const [vehicleType, setVehicleType] = useState('all');
    const [zone, setZone] = useState('all');

    useEffect(() => {
        if (initialData) {
            setPartnerName(initialData.partner_name || '');
            setPlanName(initialData.plan_name || '');
            setServiceCategory(initialData.service_category || defaultCategory);
            setBenefitType(initialData.benefit_type || 'monetary_cap');

            setLimitValue(initialData.limit_value !== undefined ? initialData.limit_value.toString() : '');
            setCurrency((initialData.currency as 'CRC' | 'USD') || 'CRC');
            setApplyAirportFee(initialData.apply_airport_fee !== false);
            if (initialData.service_category === 'fuel') {
                setFuelSuper(initialData.fuel_limits?.super?.toString() || '0');
                setFuelRegular(initialData.fuel_limits?.regular?.toString() || '0');
                setFuelDiesel(initialData.fuel_limits?.diesel?.toString() || '0');
                setCcRange(initialData.fuel_metadata?.cc_range || 'all');
                setVehicleType(initialData.fuel_metadata?.vehicle_type || 'all');
                setZone(initialData.fuel_metadata?.zone || 'all');
            }
        } else {
            resetForm();
        }
    }, [initialData, isOpen, defaultCategory]);

    const resetForm = () => {
        setPartnerName('');
        setPlanName('');
        setServiceCategory(defaultCategory);
        setBenefitType(defaultCategory === 'fuel' ? 'fuel_liters' : 'monetary_cap');
        setLimitValue('');
        setCurrency('CRC');
        setApplyAirportFee(true);
        setFuelSuper('0');
        setFuelRegular('0');
        setFuelDiesel('0');
        setCcRange('all');
        setVehicleType('all');
        setZone('all');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            id: initialData?.id,
            partner_name: partnerName,
            plan_name: planName,
            service_category: serviceCategory,
            benefit_type: serviceCategory === 'fuel' ? 'fuel_liters' : benefitType,
        };

        if (serviceCategory === 'fuel') {
            payload.fuel_limits = {
                super: Number(fuelSuper),
                regular: Number(fuelRegular),
                diesel: Number(fuelDiesel)
            };
            payload.fuel_metadata = {
                cc_range: ccRange,
                vehicle_type: vehicleType,
                zone: zone
            };
        } else {
            payload.limit_value = Number(limitValue);
            payload.currency = benefitType === 'monetary_cap' ? currency : null;

            if (serviceCategory === 'airport') {
                payload.apply_airport_fee = applyAirportFee;
            }
        }

        const success = await onSave(payload);
        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <ShieldCheck size={18} className="text-indigo-500" />
                                {initialData ? 'Editar Beneficio' : 'Nuevo Plan de Beneficios'}
                            </h3>
                            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form id="benefit-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Socio</label>
                                        <input required placeholder="Ej: ASSA" className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-colors"
                                            value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Nombre del Plan</label>
                                        <input required placeholder="Ej: General" className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-colors"
                                            value={planName} onChange={e => setPlanName(e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Categoría</label>
                                    <select className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-colors"
                                        value={serviceCategory} onChange={e => setServiceCategory(e.target.value)}>
                                        <option value="fuel">Envío de Combustible</option>
                                        <option value="towing">Grúa Liviana</option>
                                        <option value="heavy">Grúa Pesada</option>
                                        <option value="airport">Taxi Aeropuerto</option>
                                        <option value="taxi">Taxi por Avería</option>
                                        <option value="home">Asistencia Hogar</option>
                                    </select>
                                </div>

                                <AnimatePresence mode="wait">
                                    {serviceCategory === 'fuel' ? (
                                        <motion.div
                                            key="fuel-fields"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3">
                                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                                                    <Fuel size={16} /> <span className="text-xs font-bold uppercase">Límites de Litros</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Súper</label>
                                                        <input type="number" step="0.1" required value={fuelSuper} onChange={e => setFuelSuper(e.target.value)}
                                                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-center" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Regular</label>
                                                        <input type="number" step="0.1" required value={fuelRegular} onChange={e => setFuelRegular(e.target.value)}
                                                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-center" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Diesel</label>
                                                        <input type="number" step="0.1" required value={fuelDiesel} onChange={e => setFuelDiesel(e.target.value)}
                                                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-center" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><Car size={10} /> Vehículo</label>
                                                    <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                                                        <option value="all">Todos</option>
                                                        <option value="auto">Automóvil</option>
                                                        <option value="moto">Motocicleta</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><Gauge size={10} /> CC</label>
                                                    <input value={ccRange} onChange={e => setCcRange(e.target.value)} placeholder="0-2000" className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><MapPin size={10} /> Zona</label>
                                                    <select value={zone} onChange={e => setZone(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                                                        <option value="all">Todas</option>
                                                        <option value="GAM">GAM</option>
                                                        <option value="Rural">Rural</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="standard-fields"
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                            className="space-y-4"
                                        >
                                            {serviceCategory === 'airport' && (
                                                <div className="p-3 bg-sky-50 dark:bg-sky-900/10 rounded-xl border border-sky-100 dark:border-sky-800/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-sky-500 shadow-sm"><Plane size={18} /></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Fee Aeroportuario</p>
                                                            <p className="text-[10px] text-slate-500">¿Aplica recargo x1.34?</p>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={() => setApplyAirportFee(!applyAirportFee)} className={`relative w-12 h-6 rounded-full transition-colors ${applyAirportFee ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform ${applyAirportFee ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-slate-400">Tipo de Límite</label>
                                                    <div className="flex gap-4 mt-1">
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="radio" className="accent-indigo-600" checked={benefitType === 'monetary_cap'} onChange={() => setBenefitType('monetary_cap')} />
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">Monto Máximo</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="radio" className="accent-indigo-600" checked={benefitType === 'distance_cap'} onChange={() => setBenefitType('distance_cap')} />
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">Distancia (KM)</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400">Límite</label>
                                                        <input required type="number" className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                                                            value={limitValue} onChange={e => setLimitValue(e.target.value)} />
                                                    </div>
                                                    {benefitType === 'monetary_cap' && (
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase text-slate-400">Moneda</label>
                                                            <select className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                                                                value={currency} onChange={e => setCurrency(e.target.value as any)}>
                                                                <option value="CRC">CRC</option>
                                                                <option value="USD">USD</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <button form="benefit-form" type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 flex justify-center gap-2 transform active:scale-95 transition-all">
                                <Save size={18} /> GUARDAR BENEFICIO
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};