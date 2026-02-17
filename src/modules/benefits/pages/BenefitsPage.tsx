import { useState } from 'react';
import { HeartHandshake, Truck, Car, Plane, Home, Plus, Search } from 'lucide-react';
import { useBenefitsMatrix, type Benefit } from '../hooks/useBenefitsMatrix';
import { useBenefitsManagement } from '../hooks/useBenefitsManagement';
import { BenefitsTable } from '../components/BenefitsTable';
import { BenefitFormModal } from '../components/BenefitFormModal';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export const BenefitsPage = () => {
    const [activeTab, setActiveTab] = useState<'towing' | 'heavy' | 'airport' | 'taxi' | 'home'>('towing');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const { benefits, loading } = useBenefitsMatrix();
    const { saveBenefit, deleteBenefit } = useBenefitsManagement();

    const filteredBenefits = benefits
        .filter(b => b.service_category === activeTab)
        .filter(b =>
            b.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleEdit = (benefit: Benefit) => {
        setSelectedBenefit(benefit);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedBenefit(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-slate-500 animate-pulse text-center">Cargando beneficios...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                        <HeartHandshake size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Matriz de Beneficios</h2>
                        <p className="text-sm text-slate-500">Configuración de coberturas por socio</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar socio o plan..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isAdmin && (
                        <button
                            onClick={handleNew}
                            className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
                        >
                            <Plus size={18} /> NUEVO PLAN
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <TabButton active={activeTab === 'towing'} onClick={() => setActiveTab('towing')} icon={<Car size={18} />} label="Grúa Liviana" />
                <TabButton active={activeTab === 'heavy'} onClick={() => setActiveTab('heavy')} icon={<Truck size={18} />} label="Grúa Pesada" />
                <TabButton active={activeTab === 'airport'} onClick={() => setActiveTab('airport')} icon={<Plane size={18} />} label="Taxi Aeropuerto" />
                <TabButton active={activeTab === 'taxi'} onClick={() => setActiveTab('taxi')} icon={<Car size={18} />} label="Taxi Urbano" />
                <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />} label="Hogar" />
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-300">
                <BenefitsTable
                    data={filteredBenefits}
                    categoryLabel={`Planes de ${activeTab === 'airport' ? 'Taxi Aeropuerto' : activeTab === 'towing' ? 'Grúa Liviana' : activeTab}`}
                    onEdit={handleEdit}
                    onDelete={deleteBenefit}
                />
            </div>

            <BenefitFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={saveBenefit}
                initialData={selectedBenefit}
                defaultCategory={activeTab}
            />

        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
      ${active
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);