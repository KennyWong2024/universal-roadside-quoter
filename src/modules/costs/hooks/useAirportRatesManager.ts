import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { type TaxiRate } from './useAirportRates';

export const useAirportRatesManager = () => {
    const [isSaving, setIsSaving] = useState(false);

    const saveRate = async (rate: Omit<TaxiRate, 'id'>) => {
        setIsSaving(true);
        try {
            const clean = (str: string) => str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
            const id = `CR_${clean(rate.location.province)}_${clean(rate.location.canton)}_${clean(rate.location.district)}_${rate.airport_id}`;

            const docRef = doc(db, 'airport_taxi_rates', id);
            const keywords = [
                rate.location.province,
                rate.location.canton,
                rate.location.district,
                rate.airport_id,
                'costa rica'
            ].map(k => k.toLowerCase());

            await setDoc(docRef, {
                ...rate,
                search_keywords: keywords
            }, { merge: true });

            return true;
        } catch (error) {
            console.error("Error guardando tarifa:", error);
            alert("Error al guardar. Revisa la consola.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteRate = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta tarifa?")) return;
        try {
            await deleteDoc(doc(db, 'airport_taxi_rates', id));
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    return { saveRate, deleteRate, isSaving };
};