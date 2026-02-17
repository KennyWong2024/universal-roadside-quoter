import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { type Benefit } from './useBenefitsMatrix';

export const useBenefitsManagement = () => {
    const [isSaving, setIsSaving] = useState(false);

    const saveBenefit = async (benefit: Omit<Benefit, 'id'>) => {
        setIsSaving(true);
        try {
            const clean = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');

            const generatedId = `${clean(benefit.partner_name)}_${benefit.service_category}_${clean(benefit.plan_name)}`;
            const docRef = doc(db, 'benefits_matrix', generatedId);

            await setDoc(docRef, {
                ...benefit,
                partner_id: clean(benefit.partner_name)
            }, { merge: true });

            return true;
        } catch (error) {
            console.error("Error guardando beneficio:", error);
            alert("Error al guardar. Revisa la consola.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteBenefit = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar este plan de beneficios?")) return;
        try {
            await deleteDoc(doc(db, 'benefits_matrix', id));
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    return { saveBenefit, deleteBenefit, isSaving };
};