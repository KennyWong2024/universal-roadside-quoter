import { useState, useEffect, useCallback } from 'react';
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

export const useAirportRates = () => {
    const [rates, setRates] = useState<TaxiRate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRates = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'airport_taxi_rates'), orderBy('location.province'));
            const querySnapshot = await getDocs(q);
            const data: TaxiRate[] = [];

            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as TaxiRate);
            });

            setRates(data);
        } catch (error) {
            console.error("Error cargando tarifas:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRates();
    }, [fetchRates]);

    return { rates, loading, refresh: fetchRates };
};