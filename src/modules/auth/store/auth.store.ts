import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import type { AuthState } from '../types/auth.types';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    signIn: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await AuthService.loginWithGoogle();
            set({ user, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || "Error de autenticación",
                isLoading: false,
                user: null
            });
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        await AuthService.logout();
        set({ user: null, isLoading: false, error: null });
    },
}));