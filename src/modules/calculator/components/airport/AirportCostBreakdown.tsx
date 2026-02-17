import { Plane, AlertCircle } from 'lucide-react';

interface AirportCostBreakdownProps {
    calculation: any;
    currencyOptions?: Intl.NumberFormatOptions;
}

export const AirportCostBreakdown = ({ calculation, currencyOptions }: AirportCostBreakdownProps) => {
    const format = (amount: number) =>
        amount.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2, ...currencyOptions });

    if (!calculation) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center opacity-60">
                <AlertCircle className="mx-auto mb-3 text-slate-300" size={32} />
                <p className="text-sm text-slate-400 font-medium">Completa los datos para ver el desglose</p>
            </div>
        );
    }

    const feeLabel = calculation.params.fee > 1
        ? `Fee (x${calculation.params.fee}) + Parqueo`
        : `Parqueo Aeropuerto`;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-500 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-4">
                <Plane size={16} className="text-sky-500" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Desglose Taxi Aeropuerto
                </h3>
            </div>

            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Costo Base (Distrito)</span>
                <span className="font-medium">₡{format(calculation.providerCost)}</span>
            </div>

            {/* Fee y Parqueo (Texto Dinámico) */}
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{feeLabel}</span>
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    + ₡{format(calculation.clientCostBase - calculation.providerCost)}
                </span>
            </div>

            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                <span>Cobertura Socio</span>
                <span>- ₡{format(calculation.benefitApplied)}</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Excedente Neto (x Trayecto)</span>
                <span>₡{format(calculation.excedentNet)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>IVA (13%)</span>
                <span>₡{format(calculation.tax)}</span>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block">Total Cliente</span>
                        {calculation.params.isRoundTrip && (
                            <span className="text-[10px] text-sky-600 bg-sky-50 dark:bg-sky-900/30 px-1.5 py-0.5 rounded font-bold">
                                IDA Y VUELTA (x2)
                            </span>
                        )}
                    </div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white transition-colors">
                        ₡{format(calculation.grandTotal)}
                    </span>
                </div>
            </div>
        </div>
    );
};