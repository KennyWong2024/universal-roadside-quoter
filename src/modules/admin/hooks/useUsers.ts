import { useEffect, useRef } from 'react';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';
import { useUsersContext, type UserSystem } from '@/shared/context/UsersContext';

export type { UserSystem };

export const useUsers = () => {
    const { user: currentUser } = useAuthStore();
    const { users, loading, hasMore, loadMore, mutateLocalUsers } = useUsersContext();
    const hasLoggedCache = useRef(false);

    useEffect(() => {
        if (!loading && !hasLoggedCache.current && users.length > 0) {
            useDevMonitorStore.getState().trackCache('useUsers (RAM Hit)');
            hasLoggedCache.current = true;
        }
    }, [loading, users.length]);

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

        useDevMonitorStore.getState().trackWrite('useUsers (Save)');
        await setDoc(userRef, payload, { merge: true });

        mutateLocalUsers('save', { id: userId, ...payload });
    };

    const deleteUser = async (id: string) => {
        if (window.confirm(`¿Estás seguro de eliminar el acceso a ${id}? Esta acción es irreversible.`)) {
            useDevMonitorStore.getState().trackWrite('useUsers (Delete)');
            await deleteDoc(doc(db, 'allowed_users', id));

            mutateLocalUsers('delete', id);
        }
    };

    return { users, loading, hasMore, loadMore, saveUser, deleteUser };
};