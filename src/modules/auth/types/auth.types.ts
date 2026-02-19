export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'admin' | 'viewer';
    is_dev?: boolean;
}

export interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}