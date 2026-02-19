import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface TaxiRate {
    id: string;
    active: boolean;
    airport_id: string;
    country: string;
    currency: string;
    price: number;
    location: {
        province: string;
        canton: string;
        district: string;
    };
    search_keywords?: string[];
}

interface CostsContextType {
    tariffs: any[];
    fuel: any | null;
    airportRates: TaxiRate[];
    loading: boolean;
    refreshCosts: () => Promise<void>;
}

const CostsContext = createContext<CostsContextType | undefined>(undefined);

export const CostsProvider = ({ children }: { children: ReactNode }) => {
    const [tariffs, setTariffs] = useState<any[]>([]);
    const [fuel, setFuel] = useState<any | null>(null);
    const [airportRates, setAirportRates] = useState<TaxiRate[]>([]);

    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchCostsFromFirebase = useCallback(async () => {
        setLoading(true);
        console.log("💰 [CostsContext] Descargando matrices de costos a la RAM...");

        try {
            const [tariffsSnap, fuelSnap, airportSnap] = await Promise.all([
                getDocs(collection(db, 'service_tariffs')),
                getDocs(collection(db, 'fuel_prices')),
                getDocs(query(collection(db, 'airport_taxi_rates'), orderBy('location.province')))
            ]);

            const tariffsData = tariffsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTariffs(tariffsData);

            const fuelData = fuelSnap.docs[0] ? { id: fuelSnap.docs[0].id, ...fuelSnap.docs[0].data() } : null;
            setFuel(fuelData);

            const airportData: TaxiRate[] = [];
            airportSnap.forEach((doc) => {
                airportData.push({ id: doc.id, ...doc.data() } as TaxiRate);
            });
            setAirportRates(airportData);

            setIsLoaded(true);
            console.log("✅ [CostsContext] Costos guardados y blindados en memoria.");
        } catch (error) {
            console.error("❌ Error cargando la matriz de costos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) {
            fetchCostsFromFirebase();
        }
    }, [isLoaded, fetchCostsFromFirebase]);

    return (
        <CostsContext.Provider value={{
            tariffs,
            fuel,
            airportRates,
            loading,
            refreshCosts: fetchCostsFromFirebase
        }}>
            {children}
        </CostsContext.Provider>
    );
};

export const useCostsContext = () => {
    const context = useContext(CostsContext);
    if (!context) {
        throw new Error("useCostsContext debe usarse dentro de un CostsProvider");
    }
    return context;
};