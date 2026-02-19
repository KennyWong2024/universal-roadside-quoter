import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase.client';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';

export interface UserSystem {
    id: string;
    name: string;
    role: 'admin' | 'user';
    active: boolean;
    is_dev?: boolean;
    createdBy?: string;
    createdAt?: any;
}

interface UsersContextType {
    users: UserSystem[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    mutateLocalUsers: (action: 'save' | 'delete', payload: any) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const PAGE_SIZE = 20;

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<UserSystem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchInitialUsers = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'allowed_users'), orderBy('name'), limit(PAGE_SIZE));
            const snapshot = await getDocs(q);

            useDevMonitorStore.getState().trackRead('UsersContext (Initial)', snapshot.size);

            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserSystem));
            setUsers(list);

            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === PAGE_SIZE);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = async () => {
        if (!lastVisible || !hasMore) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'allowed_users'), orderBy('name'), startAfter(lastVisible), limit(PAGE_SIZE));
            const snapshot = await getDocs(q);

            useDevMonitorStore.getState().trackRead('UsersContext (Load More)', snapshot.size);

            const newList = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserSystem));
            setUsers(prev => [...prev, ...newList]);

            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === PAGE_SIZE);
        } catch (error) {
            console.error("Error cargando más usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const mutateLocalUsers = (action: 'save' | 'delete', payload: any) => {
        if (action === 'delete') {
            setUsers(prev => prev.filter(u => u.id !== payload));
        } else {
            setUsers(prev => {
                const exists = prev.find(u => u.id === payload.id);
                const updated = exists ? prev.map(u => u.id === payload.id ? payload : u) : [payload, ...prev];
                return updated.sort((a, b) => a.name.localeCompare(b.name));
            });
        }
    };

    useEffect(() => {
        fetchInitialUsers();
    }, [fetchInitialUsers]);

    return (
        <UsersContext.Provider value={{ users, loading, hasMore, loadMore, mutateLocalUsers }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsersContext = () => {
    const context = useContext(UsersContext);
    if (!context) throw new Error("useUsersContext debe usarse dentro de UsersProvider");
    return context;
};