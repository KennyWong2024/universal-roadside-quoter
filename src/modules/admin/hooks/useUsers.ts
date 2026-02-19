import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export interface UserSystem {
    id: string; // Este es el correo
    name: string;
    role: 'admin' | 'user';
    active: boolean;
    is_dev?: boolean;
    createdBy?: string;
    createdAt?: any;
}

export const useUsers = () => {
    const { user: currentUser } = useAuthStore();

    const [users, setUsers] = useState<UserSystem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'allowed_users'), (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserSystem));
            setUsers(list);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const saveUser = async (user: UserSystem) => {
        const userId = user.id.toLowerCase().trim();
        const userRef = doc(db, 'allowed_users', userId);

        const payload: any = {
            name: user.name,
            role: user.role,
            active: user.active,
            is_dev: user.is_dev || false,
        };

        const isNewUser = !users.find(u => u.id === userId);
        if (isNewUser) {
            payload.createdAt = serverTimestamp();
            payload.createdBy = currentUser?.email || 'Sistema';
        }

        await setDoc(userRef, payload, { merge: true });
    };

    const deleteUser = async (id: string) => {
        if (window.confirm(`¿Estás seguro de eliminar el acceso a ${id}? Esta acción es irreversible.`)) {
            await deleteDoc(doc(db, 'allowed_users', id));
        }
    };

    return { users, loading, saveUser, deleteUser };
};