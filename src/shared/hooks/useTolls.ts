import { useEffect, useState } from 'react';
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

export const useTolls = () => {
    const [tolls, setTolls] = useState<Toll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTolls = async () => {
            try {
                const q = query(collection(db, 'tolls_matrix'));
                const querySnapshot = await getDocs(q);

                const data: Toll[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Toll);
                });
                setTolls(data.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error("Error fetching tolls:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTolls();
    }, []);

    return { tolls, loading };
};