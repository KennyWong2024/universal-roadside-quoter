import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';

interface ExchangeRateContextType {
    rate: number;
    loading: boolean;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

const FALLBACK_RATE = 500;

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
    const [rate, setRate] = useState<number>(FALLBACK_RATE);
    const [loading, setLoading] = useState(true);

    const checkAndFetchRate = useCallback(async () => {
        setLoading(true);
        console.log("🔍 [ExchangeRate] Verificando tipo de cambio...");

        try {
            const docRef = doc(db, 'exchange_rates', 'crc_usd');
            useDevMonitorStore.getState().trackRead('ExchangeRateContext', 1);
            const docSnap = await getDoc(docRef);

            const today = new Date().toISOString().split('T')[0];
            let needsUpdate = true;
            let currentDbValue = FALLBACK_RATE;

            if (docSnap.exists()) {
                const data = docSnap.data();
                currentDbValue = data.value;
                const lastUpdateDate = data.last_update?.toDate().toISOString().split('T')[0];

                if (lastUpdateDate === today) {
                    needsUpdate = false;
                }
            }

            if (!needsUpdate) {
                useDevMonitorStore.getState().trackCache('ExchangeRateContext (Fecha al día)');
                console.log("✅ [ExchangeRate] El tipo de cambio está actualizado en la DB.");
                setRate(currentDbValue);
            } else {
                console.warn("⚠️ [ExchangeRate] El dato es viejo o no existe. Intentando Hacienda...");
                try {
                    useDevMonitorStore.getState().trackApi('Hacienda API');

                    const response = await fetch('https://api.hacienda.go.cr/indicadores/tc/dolar');
                    if (!response.ok) throw new Error('Hacienda no responde');

                    const haciendaData = await response.json();
                    const newVal = haciendaData.venta.valor;

                    await updateDoc(docRef, {
                        value: newVal,
                        last_update: serverTimestamp(),
                        source: 'Hacienda API'
                    });

                    console.log("🚀 [ExchangeRate] ¡DB Actualizada con éxito!");
                    setRate(newVal);
                } catch (apiError) {
                    useDevMonitorStore.getState().logError('ExchangeRateContext (API Hacienda)', apiError);
                    console.error("❌ [ExchangeRate] Hacienda falló. Usando último valor de la DB.", apiError);
                    setRate(currentDbValue);
                }
            }
        } catch (error) {
            useDevMonitorStore.getState().logError('ExchangeRateContext (Crítico)', error);
            console.error("❌ [ExchangeRate] Error crítico en el guardián:", error);
            setRate(FALLBACK_RATE);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAndFetchRate();
    }, [checkAndFetchRate]);

    return (
        <ExchangeRateContext.Provider value={{ rate, loading }}>
            {children}
        </ExchangeRateContext.Provider>
    );
};

export const useExchangeRateContext = () => {
    const context = useContext(ExchangeRateContext);
    if (!context) throw new Error("useExchangeRateContext debe usarse dentro de ExchangeRateProvider");
    return context;
};