import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export const useUpdateCost = () => {
    const { user } = useAuthStore();
    const [isUpdating, setIsUpdating] = useState(false);

    const updateCostDocument = async (collectionName: string, docId: string, newData: any) => {
        if (user?.role !== 'admin') {
            console.error("Acceso denegado: Se requiere rol de administrador.");
            alert("No tienes permisos para realizar esta acción.");
            return false;
        }

        setIsUpdating(true);
        try {
            const docRef = doc(db, collectionName, docId);
            await updateDoc(docRef, newData);
            console.log(`✅ ${collectionName}/${docId} actualizado correctamente.`);
            return true;
        } catch (error) {
            console.error("Error actualizando documento:", error);
            alert("Error al guardar los cambios. Revisa tu conexión.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateCostDocument, isUpdating };
};