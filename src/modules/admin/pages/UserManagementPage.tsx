import { useState } from 'react';
import { Users, Search, Trash2, ShieldCheck, User as UserIcon, UserPlus } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useUsers } from '../hooks/useUsers';
import { UserFormModal } from '../components/UserFormModal';

export const UserManagementPage = () => {
    const { user } = useAuthStore();

    const { users, saveUser, deleteUser } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/cotizador" replace />;
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20"><Users size={22} /></div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Usuarios</h2>
                        <p className="text-sm text-slate-500">Control de acceso y roles del sistema</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input type="text" placeholder="Buscar usuario..." className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                        <UserPlus size={18} /> NUEVO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 group hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {user.role === 'admin' ? <ShieldCheck size={20} /> : <UserIcon size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white leading-tight">{user.name}</h4>
                                    <p className="text-xs text-slate-400 truncate w-40">{user.id}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {user.role}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Activo</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={saveUser} />
        </div>
    );
};