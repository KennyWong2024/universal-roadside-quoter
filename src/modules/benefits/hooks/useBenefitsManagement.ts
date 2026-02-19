import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export const useBenefitsManagement = () => {
    const [isSaving, setIsSaving] = useState(false);

    // Recibimos 'benefit' como any para flexibilidad, pero esperamos la estructura correcta
    const saveBenefit = async (benefit: any) => {
        setIsSaving(true);
        try {
            // 1. Preparamos los datos limpios (sin el campo ID dentro del objeto data)
            const { id, ...dataToSave } = benefit;

            // 2. Normalizamos el Partner ID para búsquedas internas (opcional pero recomendado)
            const cleanPartnerId = benefit.partner_name
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, '_')
                .replace(/[^\w]/g, '');

            const finalPayload = {
                ...dataToSave,
                partner_id: cleanPartnerId // Mantenemos esto para filtrar fácil, pero no es el ID del documento
            };

            // 3. LÓGICA SIMPLIFICADA
            if (id) {
                // A) MODO EDICIÓN: Si ya tiene ID, actualizamos ese documento exacto.
                // No importa si cambiaste el nombre, el ID es inmutable.
                const docRef = doc(db, 'benefits_matrix', id);
                await updateDoc(docRef, finalPayload);
            } else {
                // B) MODO CREACIÓN: Dejamos que Firebase invente un ID único.
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