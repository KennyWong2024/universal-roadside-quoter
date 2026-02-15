import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { type UserSystem } from '../hooks/useUsers';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: UserSystem) => void;
}

export const UserFormModal = ({ isOpen, onClose, onSave }: UserFormModalProps) => {
    const [formData, setFormData] = useState<UserSystem>({
        id: '', name: '', role: 'user', active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
        setFormData({ id: '', name: '', role: 'user', active: true });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                                    <UserPlus size={18} />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Nuevo Usuario</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
                                <input
                                    required
                                    placeholder="Ej: Erving Calderón"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Correo Electrónico (ID)</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="nombre@connect.inc"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                                    value={formData.id}
                                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rol en el Sistema</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-xs
                                            ${formData.role === 'admin'
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                                    >
                                        <Shield size={16} /> ADMINISTRADOR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'user' })}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-xs
                                            ${formData.role === 'user'
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                                    >
                                        <User size={16} /> USUARIO
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 mt-4"
                            >
                                CREAR USUARIO
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};