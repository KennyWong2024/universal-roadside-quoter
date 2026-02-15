import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface Benefit {
    id: string;
    partner_id: string;
    partner_name: string;
    plan_name: string;
    service_category: string;
    benefit_type: 'monetary_cap' | 'distance_cap' | 'full_coverage';
    limit_value: number;
    currency: string | null;
}

export const useBenefits = (category: string) => {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                const q = query(
                    collection(db, 'benefits_matrix'),
                    where('service_category', '==', category)
                );

                const querySnapshot = await getDocs(q);
                const data: Benefit[] = [];

                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Benefit);
                });
                setBenefits(data.sort((a, b) => a.plan_name.localeCompare(b.plan_name)));
            } catch (error) {
                console.error("Error fetching benefits:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, [category]);

    return { benefits, loading };
};