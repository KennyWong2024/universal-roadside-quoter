import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useAirportRates } from './useAirportRates';

export const useAirportRatesManager = () => {
    const [isSaving, setIsSaving] = useState(false);
    const { refresh } = useAirportRates();

    const saveRate = async (rateData: any) => {
        setIsSaving(true);
        try {
            const keywords = [
                rateData.location.province,
                rateData.location.canton,
                rateData.location.district,
                rateData.airport_id,
                'costa rica'
            ].map(k => k.toLowerCase());

            const payload = { ...rateData, search_keywords: keywords };

            if (rateData.id) {
                const { id, ...data } = payload;
                await updateDoc(doc(db, 'airport_taxi_rates', id), data);
            } else {
                await addDoc(collection(db, 'airport_taxi_rates'), payload);
            }

            await refresh();
            return true;
        } catch (error) {
            console.error("Error guardando tarifa:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteRate = async (id: string) => {
        setIsSaving(true);
        try {
            await deleteDoc(doc(db, 'airport_taxi_rates', id));
            await refresh();
            return true;
        } catch (error) {
            console.error("Error eliminando tarifa:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { saveRate, deleteRate, isSaving };
};