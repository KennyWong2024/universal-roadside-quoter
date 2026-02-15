import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export const useCostMatrix = () => {
    const [data, setData] = useState<any>({
        tariffs: [],
        tolls: [],
        fuel: null,
        loading: true
    });

    useEffect(() => {
        const qTariffs = query(collection(db, 'service_tariffs'));
        const qTolls = query(collection(db, 'tolls_matrix'));
        const qFuel = query(collection(db, 'fuel_prices'));

        const unsubTariffs = onSnapshot(qTariffs, (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData((prev: any) => ({ ...prev, tariffs: items }));
        });

        const unsubTolls = onSnapshot(qTolls, (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData((prev: any) => ({ ...prev, tolls: items }));
        });

        const unsubFuel = onSnapshot(qFuel, (snap) => {
            const fuelData = snap.docs[0]?.data();
            setData((prev: any) => ({ ...prev, fuel: fuelData, loading: false }));
        });

        return () => {
            unsubTariffs();
            unsubTolls();
            unsubFuel();
        };
    }, []);

    return data;
};