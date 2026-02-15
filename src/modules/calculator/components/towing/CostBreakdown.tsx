import { type QuoteResult } from '../../engine/useTowingQuote';

interface CostBreakdownProps {
    quote: QuoteResult;
    isFallback: boolean;
}

export const CostBreakdown = ({ quote, isFallback }: CostBreakdownProps) => {
    const currencyOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Desglose de Costos
            </h3>

            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Costo del Servicio</span>
                <span className="font-medium">₡{quote.serviceSubtotal.toLocaleString('es-CR', currencyOptions)}</span>
            </div>

            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                <span>Cobertura Socio</span>
                <span>- ₡{quote.benefitCovered.toLocaleString('es-CR', currencyOptions)}</span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Excedente Neto</span>
                <span>₡{quote.clientExcedente.toLocaleString('es-CR', currencyOptions)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>IVA (13%)</span>
                <span>₡{quote.taxAmount.toLocaleString('es-CR', currencyOptions)}</span>
            </div>

            {quote.exchangeRateUsed && (
                <div className={`flex justify-between text-[10px] p-1.5 rounded-lg px-2 mt-1 font-bold tracking-tight
          ${isFallback
                        ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                        : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>
                    <span>T.C. APLICADO {isFallback ? '(OFFLINE)' : '(HACIENDA)'}</span>
                    <span>₡{quote.exchangeRateUsed.toLocaleString('es-CR')} / USD</span>
                </div>
            )}

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Total Cliente</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white transition-colors">
                        ₡{quote.finalTotal.toLocaleString('es-CR', currencyOptions)}
                    </span>
                </div>
            </div>
        </div>
    );
};