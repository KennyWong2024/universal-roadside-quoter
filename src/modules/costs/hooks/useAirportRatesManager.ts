import { useState } from 'react';
import { updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useCostsContext } from '@/shared/context/CostsContext';

export const useAirportRatesManager = () => {
    const [isSaving, setIsSaving] = useState(false);
    const { refreshCosts } = useCostsContext();

    const saveRate = async (rateData: any) => {
        setIsSaving(true);
        try {
            const keywords = [
                rateData.location.province,
                rateData.location.canton,
                rateData.location.district,
                rateData.airport_id,
                'costa rica'
            ].map((k: string) => k.toLowerCase());

            const payload = { ...rateData, search_keywords: keywords };

            if (rateData.id) {
                const { id, ...data } = payload;
                await updateDoc(doc(db, 'airport_taxi_rates', id), data);
            } else {
                const cleanStr = (str: string) =>
                    str.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toUpperCase()
                        .replace(/\s+/g, '_');

                const customId = `CR_${cleanStr(rateData.location.province)}_${cleanStr(rateData.location.canton)}_${cleanStr(rateData.location.district)}_${rateData.airport_id}`;

                await setDoc(doc(db, 'airport_taxi_rates', customId), payload);
            }

            await refreshCosts();
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
            await refreshCosts();
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