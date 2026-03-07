import { Home, AlertCircle } from 'lucide-react';
import { type HomeCalculation } from '../../engine/useHomeQuote';

interface HomeCostBreakdownProps {
    calculation: HomeCalculation | null;
    isFallback?: boolean;
}

export const HomeCostBreakdown = ({ calculation, isFallback = false }: HomeCostBreakdownProps) => {
    const format = (amount: number) =>
        amount.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (!calculation) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center opacity-60">
                <AlertCircle className="mx-auto mb-3 text-slate-300" size={32} />
                <p className="text-sm text-slate-400 font-medium">Completa los datos para ver el desglose</p>
            </div>
        );
    }

    const {
        laborCost,
        mileageCost,
        materialsCost,
        nightSurcharge,
        fixedFee,
        providerTotal,
        benefitApplied,
        excedentNet,
        tax,
        grandTotal,
        exchangeRateUsed,
        benefitCurrency
    } = calculation;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-500 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-4">
                <Home size={16} className="text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Desglose Asistencia Hogar
                </h3>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Horas de Trabajo</span>
                    <span className="font-medium">₡{format(laborCost)}</span>
                </div>
                {mileageCost > 0 && (
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span>Kilometraje Adicional</span>
                        <span className="font-medium">₡{format(mileageCost)}</span>
                    </div>
                )}
                {materialsCost > 0 && (
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span>Materiales</span>
                        <span className="font-medium">₡{format(materialsCost)}</span>
                    </div>
                )}
                {nightSurcharge > 0 && (
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span>Recargo Nocturno</span>
                        <span className="font-medium">₡{format(nightSurcharge)}</span>
                    </div>
                )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Total Proveedor</span>
                <span className="font-medium">₡{format(providerTotal)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Fee Administrativo</span>
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    + ₡{format(fixedFee)}
                </span>
            </div>

            <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                <span>Cobertura Socio {benefitCurrency === 'USD' ? '(USD)' : ''}</span>
                <span>- ₡{format(benefitApplied)}</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Excedente Neto</span>
                <span>₡{format(excedentNet)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>IVA (13%)</span>
                <span>₡{format(tax)}</span>
            </div>

            {exchangeRateUsed && (
                <div className={`flex justify-between text-[10px] p-1.5 rounded-lg px-2 mt-2 font-bold tracking-tight
                    ${isFallback
                        ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                        : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>
                    <span>T.C. APLICADO {isFallback ? '(OFFLINE)' : '(HACIENDA)'}</span>
                    <span>₡{exchangeRateUsed.toLocaleString('es-CR')} / USD</span>
                </div>
            )}

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block">Total Cliente</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white transition-colors">
                        ₡{format(grandTotal)}
                    </span>
                </div>
            </div>
        </div>
    );
};