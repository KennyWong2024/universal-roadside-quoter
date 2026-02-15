import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/core/firebase/firebase.client";
import type { UserProfile } from "../types/auth.types";

const googleProvider = new GoogleAuthProvider();

export const AuthService = {
    loginWithGoogle: async (): Promise<UserProfile> => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const { user } = userCredential;

            if (!user.email) throw new Error("No se obtuvo email de Google.");

            const userDocRef = doc(db, "allowed_users", user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await signOut(auth);
                throw new Error("Usuario no autorizado.");
            }

            const userData = userDocSnap.data();
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData.name,
                photoURL: user.photoURL || "",
                role: userData.role,
            };

        } catch (error: any) {
            console.error("Auth Error:", error);
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
    }
};