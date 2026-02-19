import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/core/firebase/firebase.client";
import type { UserProfile } from "../types/auth.types";

const googleProvider = new GoogleAuthProvider();

export const AuthService = {
    validateUserPermissions: async (email: string): Promise<any> => {
        const userDocRef = doc(db, "allowed_users", email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error("Usuario no autorizado en base de datos.");
        }

        const userData = userDocSnap.data();
        if (!userData.active) {
            throw new Error("Usuario desactivado.");
        }

        return userData;
    },

    loginWithGoogle: async (): Promise<UserProfile> => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const { user } = userCredential;

            if (!user.email) throw new Error("No se obtuvo email de Google.");

            const userData = await AuthService.validateUserPermissions(user.email);

            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData.name,
                photoURL: user.photoURL || "",
                role: userData.role,
                is_dev: userData.is_dev || false,
            };

        } catch (error: any) {
            console.error("Auth Error:", error);
            await signOut(auth);
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
    }
};