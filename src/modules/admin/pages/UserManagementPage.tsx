import { useState } from 'react';
import { Users, Search, Trash2, ShieldCheck, User as UserIcon, UserPlus, Terminal, CheckCircle2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useUsers } from '../hooks/useUsers';
import { UserFormModal } from '../components/UserFormModal';

type FilterType = 'all' | 'dev' | 'admin' | 'user';

export const UserManagementPage = () => {
    const { user: currentUser } = useAuthStore();
    const { users, saveUser, deleteUser } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!currentUser || (currentUser.role !== 'admin' && !currentUser.is_dev)) {
        return <Navigate to="/cotizador" replace />;
    }

    let processedUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            activeFilter === 'all' ? true :
                activeFilter === 'dev' ? u.is_dev :
                    activeFilter === 'admin' ? (u.role === 'admin' && !u.is_dev) :
                        (u.role === 'user');

        return matchesSearch && matchesFilter;
    });

    processedUsers = processedUsers.sort((a, b) => a.name.localeCompare(b.name));

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
                        <input type="text" placeholder="Buscar usuario..." className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 text-slate-800 dark:text-white"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                        <UserPlus size={18} /> NUEVO
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-xl w-fit">
                {(['all', 'dev', 'admin', 'user'] as FilterType[]).map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all
                            ${activeFilter === f
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {f === 'all' ? 'Todos' : f === 'dev' ? 'Devs' : f === 'admin' ? 'Admins' : 'Usuarios'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedUsers.map(user => {
                    const isMe = currentUser?.email === user.id;
                    const isImmune = user.is_dev && !currentUser?.is_dev;
                    const canDelete = !isMe && !isImmune;

                    return (
                        <div key={user.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all relative overflow-hidden group
                            ${isMe ? 'border-green-500/50 shadow-lg shadow-green-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50'}`}>

                            {isMe && <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full pointer-events-none" />}

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl 
                                        ${user.is_dev ? 'bg-emerald-500/10 text-emerald-500' :
                                            user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                                                'bg-blue-500/10 text-blue-500'}`}>
                                        {user.is_dev ? <Terminal size={20} /> :
                                            user.role === 'admin' ? <ShieldCheck size={20} /> :
                                                <UserIcon size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-2">
                                            {user.name}
                                            {isMe && <CheckCircle2 size={14} className="text-green-500" />}
                                        </h4>
                                        <p className="text-xs text-slate-400 truncate w-48">{user.id}</p>
                                    </div>
                                </div>

                                {canDelete && (
                                    <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="mt-5 flex items-center justify-between relative z-10 border-t border-slate-100 dark:border-slate-800/50 pt-4">

                                {isMe ? (
                                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 tracking-wider">
                                        ESTA ES TU CUENTA
                                    </span>
                                ) : (
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider
                                        ${user.is_dev ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                            user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                        {user.is_dev ? '<DEV />' : user.role}
                                    </span>
                                )}

                                {user.createdBy ? (
                                    <span className="text-[9px] text-slate-400 italic" title={`Creado por: ${user.createdBy}`}>
                                        Por: {user.createdBy.split('@')[0]}
                                    </span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Activo</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={saveUser} />
        </div>
    );
};