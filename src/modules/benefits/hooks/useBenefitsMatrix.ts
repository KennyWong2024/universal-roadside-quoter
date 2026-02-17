import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface Benefit {
    id: string;
    partner_id: string;
    partner_name: string;
    plan_name: string;
    service_category: 'towing' | 'heavy' | 'taxi' | 'airport' | 'home';
    benefit_type: 'monetary_cap' | 'distance_cap';
    limit_value: number;
    currency?: 'CRC' | 'USD' | null;
    active?: boolean;
}

export const useBenefitsMatrix = () => {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'benefits_matrix'), orderBy('partner_name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Benefit[];

            setBenefits(items);
            setLoading(false);
        }, (error) => {
            console.error("Error cargando beneficios:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { benefits, loading };
};