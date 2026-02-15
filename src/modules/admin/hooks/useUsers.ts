import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';

export interface UserSystem {
    id: string;
    name: string;
    role: 'admin' | 'user';
    active: boolean;
}

export const useUsers = () => {
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
        const userRef = doc(db, 'allowed_users', user.id.toLowerCase().trim());
        await setDoc(userRef, {
            name: user.name,
            role: user.role,
            active: user.active
        });
    };

    const deleteUser = async (id: string) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${id}?`)) {
            await deleteDoc(doc(db, 'allowed_users', id));
        }
    };

    return { users, loading, saveUser, deleteUser };
};