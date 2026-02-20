import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, analytics } from '@/core/firebase/firebase.client';
import { setUserId, setUserProperties } from 'firebase/analytics';
import type { AuthState, UserProfile } from '../types/auth.types';

interface AuthStore extends AuthState {
    status: 'checking' | 'authenticated' | 'unauthenticated';
    checkSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    status: 'checking',

    signIn: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await AuthService.loginWithGoogle();
            set({ user, isLoading: false, status: 'authenticated' });

            if (analytics && user.email) {
                setUserId(analytics, user.email);
                setUserProperties(analytics, {
                    role: user.role,
                    is_dev: user.is_dev ? 'true' : 'false'
                });
            }

        } catch (error: any) {
            set({
                error: error.message || "Error de autenticación",
                isLoading: false,
                user: null,
                status: 'unauthenticated'
            });
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        await AuthService.logout();

        if (analytics) {
            setUserId(analytics, null);
        }

        set({ user: null, isLoading: false, error: null, status: 'unauthenticated' });
    },

    checkSession: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                try {
                    const userData = await AuthService.validateUserPermissions(firebaseUser.email);
                    const userProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || userData.name,
                        photoURL: firebaseUser.photoURL || "",
                        role: userData.role,
                        is_dev: userData.is_dev || false
                    };

                    if (analytics) {
                        setUserId(analytics, userProfile.email);

                        setUserProperties(analytics, {
                            role: userProfile.role,
                            is_dev: userProfile.is_dev ? 'true' : 'false',
                        });
                    }

                    set({ user: userProfile, status: 'authenticated' });
                } catch (error) {
                    console.error("Sesión invalidada:", error);
                    await AuthService.logout();
                    if (analytics) setUserId(analytics, null);
                    set({ user: null, status: 'unauthenticated' });
                }
            } else {
                if (analytics) setUserId(analytics, null);
                set({ user: null, status: 'unauthenticated' });
            }
        });

        return unsubscribe;
    }
}));