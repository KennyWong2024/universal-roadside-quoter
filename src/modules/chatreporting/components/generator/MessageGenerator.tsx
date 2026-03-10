import { useState } from 'react';
import { Car, Truck, CarFront } from 'lucide-react';
import { WhatsAppPreview } from './WhatsAppPreview';
import { SimpleTransferForm } from './forms/SimpleTransferForm';
import { VehicleSwapForm } from './forms/VehicleSwapForm';
import { TaxiReportForm } from './forms/TaxiReportForm';

type ReportType = 'towing' | 'swap' | 'taxi';

export const MessageGenerator = () => {
    const [activeReport, setActiveReport] = useState<ReportType>('towing');
    const [currentMessage, setCurrentMessage] = useState('');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 w-full">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl flex gap-1 overflow-x-auto shrink-0">
                    <TabButton active={activeReport === 'towing'} onClick={() => setActiveReport('towing')} icon={<Truck size={18} />} label="Traslado Simple" />
                    <TabButton active={activeReport === 'swap'} onClick={() => setActiveReport('swap')} icon={<Car size={18} />} label="Cambio de Vehículo" />
                    <TabButton active={activeReport === 'taxi'} onClick={() => setActiveReport('taxi')} icon={<CarFront size={18} />} label="Taxi" />
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-y-auto custom-scrollbar">
                    <div className={activeReport === 'towing' ? 'block' : 'hidden'}>
                        <SimpleTransferForm onMessageChange={activeReport === 'towing' ? setCurrentMessage : () => { }} />
                    </div>
                    <div className={activeReport === 'swap' ? 'block' : 'hidden'}>
                        <VehicleSwapForm onMessageChange={activeReport === 'swap' ? setCurrentMessage : () => { }} />
                    </div>
                    <div className={activeReport === 'taxi' ? 'block' : 'hidden'}>
                        <TaxiReportForm onMessageChange={activeReport === 'taxi' ? setCurrentMessage : () => { }} />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 h-[600px] xl:h-[700px]">
                <WhatsAppPreview message={currentMessage} />
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-white/50'}`}>
        {icon} {label}
    </button>
);