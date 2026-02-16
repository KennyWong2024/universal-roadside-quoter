import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface TaxiRate {
    id: string;
    location: {
        province: string;
        canton: string;
        district: string;
    };
    airport_id: string;
    price: number;
    currency: string;
    active: boolean;
}

export const useAirportRates = () => {
    const [rates, setRates] = useState<TaxiRate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'airport_taxi_rates'), orderBy('location.province'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as TaxiRate[];

            setRates(items);
            setLoading(false);
        }, (error) => {
            console.error("Error al cargar tarifas de taxi:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { rates, loading };
};