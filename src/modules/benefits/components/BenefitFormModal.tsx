import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ShieldCheck } from 'lucide-react';
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
    const [benefitType, setBenefitType] = useState<'monetary_cap' | 'distance_cap'>('monetary_cap');
    const [limitValue, setLimitValue] = useState<string>('');
    const [currency, setCurrency] = useState<'CRC' | 'USD'>('CRC');

    useEffect(() => {
        if (initialData) {
            setPartnerName(initialData.partner_name);
            setPlanName(initialData.plan_name);
            setServiceCategory(initialData.service_category);
            setBenefitType(initialData.benefit_type);
            setLimitValue(initialData.limit_value.toString());
            setCurrency(initialData.currency || 'CRC');
        } else {
            setPartnerName('');
            setPlanName('');
            setServiceCategory(defaultCategory);
            setBenefitType('monetary_cap');
            setLimitValue('');
            setCurrency('CRC');
        }
    }, [initialData, isOpen, defaultCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSave({
            partner_name: partnerName,
            plan_name: planName,
            service_category: serviceCategory,
            benefit_type: benefitType,
            limit_value: Number(limitValue),
            currency: benefitType === 'monetary_cap' ? currency : null,
            active: true
        });
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
                                <ShieldCheck size={18} className="text-indigo-500" />
                                {initialData ? 'Editar Beneficio' : 'Nuevo Plan de Beneficios'}
                            </h3>
                            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Socio (Aseguradora)</label>
                                    <input required placeholder="Ej: ASSA" className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                                        value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Nombre del Plan</label>
                                    <input required placeholder="Ej: Cobertura Total" className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                                        value={planName} onChange={e => setPlanName(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400">Categoría de Servicio</label>
                                <select className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                                    value={serviceCategory} onChange={e => setServiceCategory(e.target.value)}>
                                    <option value="towing">Grúa Liviana</option>
                                    <option value="heavy">Grúa Pesada</option>
                                    <option value="airport">Taxi Aeropuerto</option>
                                    <option value="taxi">Taxi por Avería</option>
                                    <option value="home">Asistencia Hogar</option>
                                </select>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Tipo de Límite</label>
                                    <div className="flex gap-4 mt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={benefitType === 'monetary_cap'} onChange={() => setBenefitType('monetary_cap')} />
                                            <span className="text-sm">Monto Máximo (Dinero)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={benefitType === 'distance_cap'} onChange={() => setBenefitType('distance_cap')} />
                                            <span className="text-sm">Distancia Máxima (KM)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Límite ({benefitType === 'distance_cap' ? 'KM' : 'Monto'})</label>
                                        <input required type="number" className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                                            value={limitValue} onChange={e => setLimitValue(e.target.value)} />
                                    </div>

                                    {benefitType === 'monetary_cap' && (
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400">Moneda</label>
                                            <select className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                                                value={currency} onChange={e => setCurrency(e.target.value as any)}>
                                                <option value="CRC">Colones (CRC)</option>
                                                <option value="USD">Dólares (USD)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 mt-2 flex justify-center gap-2">
                                <Save size={18} /> GUARDAR BENEFICIO
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};