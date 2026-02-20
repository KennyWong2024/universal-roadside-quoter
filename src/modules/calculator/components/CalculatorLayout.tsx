import { useState } from 'react';
import { useCalculatorStore } from '../store/calculator.store';
import { Car, Plane, Home, Truck, PictureInPicture2 } from 'lucide-react';
import { GlassCard } from '@/shared/ui/GlassCard';
import { TowingForm } from './towing/TowingForm';
import { HeavyTowingForm } from './heavy/HeavyTowingForm';
import { AirportForm } from './airport/AirportForm';
import { PiPWindow } from '@/shared/ui/PiPWindow';

export const CalculatorLayout = () => {
    const { activeTab, setActiveTab } = useCalculatorStore();
    const [isFloating, setIsFloating] = useState(false);

    const renderActiveForm = () => (
        <div className="w-full">
            {activeTab === 'towing' && <TowingForm />}
            {activeTab === 'heavy' && <HeavyTowingForm />}
            {activeTab === 'taxi_airport' && <AirportForm />}
            {activeTab === 'home' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center text-slate-400 py-20">
                    <Home size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Módulo de Asistencia Hogar pendiente</p>
                </div>
            )}
        </div>
    );

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

                <div className="flex items-center gap-4">
                    {!isFloating && (
                        <button
                            onClick={() => setIsFloating(true)}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs hover:bg-indigo-500/20 transition-all border border-indigo-500/20 active:scale-95"
                            title="Llevar cotizador a ventana flotante"
                        >
                            <PictureInPicture2 size={16} />
                            FLOTAR
                        </button>
                    )}

                    <div className="flex flex-wrap justify-center p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl backdrop-blur-md border border-slate-300 dark:border-slate-700/50 relative">
                        <TabButton isActive={activeTab === 'towing'} onClick={() => setActiveTab('towing')} icon={<Car size={18} />} label="Grúa Liviana" />
                        <TabButton isActive={activeTab === 'heavy'} onClick={() => setActiveTab('heavy')} icon={<Truck size={18} />} label="Grúa Pesada" />
                        <TabButton isActive={activeTab === 'taxi_airport'} onClick={() => setActiveTab('taxi_airport')} icon={<Plane size={18} />} label="Taxi Aeropuerto" />
                        <TabButton isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />} label="Asistencia Hogar" />
                    </div>
                </div>
            </div>

            {isFloating ? (
                <>
                    <PiPWindow onClose={() => setIsFloating(false)}>
                        <div className="p-2">
                            {renderActiveForm()}
                        </div>
                    </PiPWindow>

                    <GlassCard className="min-h-[400px] flex flex-col items-center justify-center text-center p-10 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
                        <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full mb-4 animate-bounce">
                            <PictureInPicture2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Modo Flotante Activo</h2>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs">
                            El cotizador se encuentra en una ventana independiente sobre tus otras aplicaciones.
                        </p>
                        <button
                            onClick={() => setIsFloating(false)}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform"
                        >
                            DEVOLVER AQUÍ
                        </button>
                    </GlassCard>
                </>
            ) : (
                <GlassCard className="min-h-[600px] p-6 lg:p-10 border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 transition-all duration-300">
                    {renderActiveForm()}
                </GlassCard>
            )}
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