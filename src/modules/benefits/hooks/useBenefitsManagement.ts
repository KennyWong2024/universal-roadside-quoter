import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export const useBenefitsManagement = () => {
    const [isSaving, setIsSaving] = useState(false);
    const saveBenefit = async (benefit: any) => {
        setIsSaving(true);
        try {
            const { id, ...dataToSave } = benefit;

            const cleanPartnerId = benefit.partner_name
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, '_')
                .replace(/[^\w]/g, '');

            const finalPayload = {
                ...dataToSave,
                partner_id: cleanPartnerId
            };

            if (id) {
                const docRef = doc(db, 'benefits_matrix', id);
                await updateDoc(docRef, finalPayload);
            } else {
                await addDoc(collection(db, 'benefits_matrix'), finalPayload);
            }

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