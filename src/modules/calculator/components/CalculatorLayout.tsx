import { useCalculatorStore } from '../store/calculator.store';
import { Car, Plane, Home, Truck } from 'lucide-react';
import { GlassCard } from '@/shared/ui/GlassCard';
import { TowingForm } from './towing/TowingForm';
import { HeavyTowingForm } from './heavy/HeavyTowingForm';

export const CalculatorLayout = () => {
    const { activeTab, setActiveTab } = useCalculatorStore();

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
                <div className="text-center xl:text-left">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                        Cotizador Inteligente
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Selecciona el tipo de servicio para comenzar
                    </p>
                </div>

                <div className="flex flex-wrap justify-center p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl backdrop-blur-md border border-slate-300 dark:border-slate-700/50 relative">
                    <TabButton
                        isActive={activeTab === 'towing'}
                        onClick={() => setActiveTab('towing')}
                        icon={<Car size={18} />}
                        label="Grúa Liviana"
                    />
                    <TabButton
                        isActive={activeTab === 'heavy'}
                        onClick={() => setActiveTab('heavy')}
                        icon={<Truck size={18} />}
                        label="Grúa Pesada"
                    />
                    <TabButton
                        isActive={activeTab === 'taxi_airport'}
                        onClick={() => setActiveTab('taxi_airport')}
                        icon={<Plane size={18} />}
                        label="Taxi Aeropuerto"
                    />
                    <TabButton
                        isActive={activeTab === 'home'}
                        onClick={() => setActiveTab('home')}
                        icon={<Home size={18} />}
                        label="Asistencia Hogar"
                    />
                </div>
            </div>

            <GlassCard className="min-h-[600px] p-6 lg:p-10 border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 transition-all duration-300">

                {activeTab === 'towing' && (
                    <TowingForm />
                )}

                {activeTab === 'heavy' && (
                    <HeavyTowingForm />
                )}

                {activeTab === 'taxi_airport' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center text-slate-400 py-20">
                        <Plane size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Módulo de Taxi Aeropuerto pendiente</p>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center text-slate-400 py-20">
                        <Home size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Módulo de Asistencia Hogar pendiente</p>
                    </div>
                )}

            </GlassCard>
        </div>
    );
};

const TabButton = ({ isActive, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`
      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 m-1
      ${isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md shadow-slate-900/5 transform scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'}
    `}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);