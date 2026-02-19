import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { LogOut, Calculator, FileText, Table2, Sun, Moon, Users, Activity } from 'lucide-react';
import { useTheme } from '../theme/useTheme';


export const DashboardLayout = () => {
    const { user, signOut } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex h-screen w-screen bg-[#f0f2f5] dark:bg-[#0a0e17] overflow-hidden transition-colors duration-500">
            <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between z-50">

                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        UR
                    </div>
                    <span className="hidden lg:block ml-3 font-bold text-slate-800 dark:text-white select-none">Roadside</span>
                </div>

                <nav className="flex-1 py-8 flex flex-col gap-2 px-2 lg:px-4">
                    <NavItem to="/cotizador" icon={<Calculator size={20} />} label="Cotizador" />
                    <NavItem to="/notas" icon={<FileText size={20} />} label="Notas" />
                    <NavItem to="/matriz-costos" icon={<Table2 size={20} />} label="Matriz Costos" />
                    <NavItem to="/matriz-beneficios" icon={<Table2 size={20} />} label="Matriz Beneficios" />
                    {(user?.role === 'admin' || user?.is_dev) && (
                        <NavItem to="/usuarios" icon={<Users size={20} />} label="Usuarios" />
                    )}
                    {user?.is_dev && (
                        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <NavItem to="/monitoreo" icon={<Activity size={20} />} label="Dev Panel" />
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                        <div className="hidden lg:block overflow-hidden flex-1">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user?.displayName?.split(' ')[0]}</p>

                            {user?.is_dev ? (
                                <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase truncate animate-pulse">
                                    &lt;Dev /&gt;
                                </p>
                            ) : (
                                <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role}</p>
                            )}
                        </div>
                        <button onClick={toggleTheme} className="p-1.5 text-slate-400 hover:text-yellow-500 rounded-lg">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button onClick={() => signOut()} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, to }: { icon: any, label: string, to: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
            w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
            ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-500'}
        `}
    >
        {icon}
        <span className="hidden lg:block font-medium text-sm">{label}</span>
    </NavLink>
);