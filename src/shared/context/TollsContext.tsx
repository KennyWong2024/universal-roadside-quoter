import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface Toll {
    id: string;
    name: string;
    route: string;
    currency: string;
    prices: {
        light: number;
        microbus: number;
        tow: number;
        heavy: number;
    };
}

interface TollsContextType {
    tolls: Toll[];
    loading: boolean;
}

const TollsContext = createContext<TollsContextType | undefined>(undefined);

export const TollsProvider = ({ children }: { children: ReactNode }) => {
    const [tolls, setTolls] = useState<Toll[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchTolls = useCallback(async () => {
        if (isLoaded) return;
        console.log("🛣️ [TollsContext] Cargando matriz de peajes en RAM...");

        setLoading(true);
        try {
            const q = query(collection(db, 'tolls_matrix'));
            const querySnapshot = await getDocs(q);
            const data: Toll[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Toll));

            setTolls(data.sort((a, b) => a.name.localeCompare(b.name)));
            setIsLoaded(true);
        } catch (error) {
            console.error("Error cargando peajes:", error);
        } finally {
            setLoading(false);
        }
    }, [isLoaded]);

    useEffect(() => {
        fetchTolls();
    }, [fetchTolls]);

    return (
        <TollsContext.Provider value={{ tolls, loading }}>
            {children}
        </TollsContext.Provider>
    );
};

export const useTollsContext = () => {
    const context = useContext(TollsContext);
    if (!context) throw new Error("useTollsContext debe usarse dentro de TollsProvider");
    return context;
};