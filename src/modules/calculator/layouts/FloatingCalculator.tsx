import { useCalculatorStore } from '../store/calculator.store';
import { Car, Plane, Home, Truck } from 'lucide-react';
import { TowingForm } from '../components/towing/TowingForm';
import { HeavyTowingForm } from '../components/heavy/HeavyTowingForm';
import { AirportForm } from '../components/airport/AirportForm';

export const FloatingCalculator = () => {
    const { activeTab, setActiveTab } = useCalculatorStore();

    return (
        <div className="flex flex-col h-screen w-full bg-[#f0f2f5] dark:bg-[#0a0e17]">
            <header className="flex items-center justify-center px-3 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                    <NavButton isActive={activeTab === 'towing'} onClick={() => setActiveTab('towing')} icon={<Car size={18} />} title="Grúa Liviana" />
                    <NavButton isActive={activeTab === 'heavy'} onClick={() => setActiveTab('heavy')} icon={<Truck size={18} />} title="Grúa Pesada" />
                    <NavButton isActive={activeTab === 'taxi_airport'} onClick={() => setActiveTab('taxi_airport')} icon={<Plane size={18} />} title="Taxi Aeropuerto" />
                    <NavButton isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />} title="Asistencia Hogar" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
                <div className="origin-top-left transition-all duration-300" style={{ transform: 'scale(0.85)', width: '117.64%' }}>
                    {activeTab === 'towing' && <TowingForm />}
                    {activeTab === 'heavy' && <HeavyTowingForm />}
                    {activeTab === 'taxi_airport' && <AirportForm />}
                    {activeTab === 'home' && (
                        <div className="text-center text-slate-400 py-20 flex flex-col items-center">
                            <Home size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-lg">Módulo pendiente</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const NavButton = ({ isActive, onClick, icon, title }: any) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-2.5 rounded-lg transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
            }`}
    >
        {icon}
    </button>
);