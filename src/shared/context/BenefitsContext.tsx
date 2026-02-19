import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { type Benefit } from '../../modules/benefits/hooks/useBenefitsMatrix';

interface BenefitsContextType {
    benefits: Benefit[];
    loading: boolean;
    refreshBenefits: () => Promise<void>;
}

const BenefitsContext = createContext<BenefitsContextType | undefined>(undefined);

export const BenefitsProvider = ({ children }: { children: ReactNode }) => {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchFromFirebase = useCallback(async () => {
        setLoading(true);
        console.log("🔥 [BenefitsContext] Leyendo de Firebase...");

        try {
            const q = query(collection(db, 'benefits_matrix'), orderBy('partner_name'));
            const querySnapshot = await getDocs(q);

            const data: Benefit[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Benefit);
            });

            setBenefits(data);
            setIsLoaded(true);
        } catch (error) {
            console.error("Error cargando beneficios:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) {
            fetchFromFirebase();
        }
    }, [isLoaded, fetchFromFirebase]);

    return (
        <BenefitsContext.Provider value={{
            benefits,
            loading,
            refreshBenefits: fetchFromFirebase
        }}>
            {children}
        </BenefitsContext.Provider>
    );
};

export const useBenefitsContext = () => {
    const context = useContext(BenefitsContext);
    if (!context) {
        throw new Error("useBenefitsContext debe usarse dentro de un BenefitsProvider");
    }
    return context;
};