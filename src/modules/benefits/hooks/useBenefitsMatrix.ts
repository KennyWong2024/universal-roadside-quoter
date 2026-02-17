import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface Benefit {
    id: string;
    partner_id?: string;
    partner_name: string;
    plan_name: string;
    service_category: string;
    benefit_type: 'monetary_cap' | 'distance_cap';
    limit_value: number;
    currency?: 'CRC' | 'USD' | null;
    active?: boolean;
    apply_airport_fee?: boolean;
}

export const useBenefitsMatrix = () => {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBenefits = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'benefits_matrix'), orderBy('partner_name'));
            const querySnapshot = await getDocs(q);
            const data: Benefit[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Benefit);
            });
            setBenefits(data);
        } catch (error) {
            console.error("Error cargando beneficios:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const createBenefit = async (benefit: Omit<Benefit, 'id'>) => {
        try {
            await addDoc(collection(db, 'benefits_matrix'), benefit);
            await fetchBenefits();
            return true;
        } catch (error) {
            console.error("Error creando beneficio:", error);
            return false;
        }
    };

    const updateBenefit = async (id: string, benefit: Partial<Benefit>) => {
        try {
            const benefitRef = doc(db, 'benefits_matrix', id);
            await updateDoc(benefitRef, benefit);
            await fetchBenefits();
            return true;
        } catch (error) {
            console.error("Error actualizando beneficio:", error);
            return false;
        }
    };

    const deleteBenefit = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este beneficio?")) return;
        try {
            await deleteDoc(doc(db, 'benefits_matrix', id));
            await fetchBenefits();
        } catch (error) {
            console.error("Error eliminando beneficio:", error);
        }
    };

    return {
        benefits,
        loading,
        createBenefit,
        updateBenefit,
        deleteBenefit,
        refresh: fetchBenefits
    };
};