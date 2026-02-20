import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export let analytics: Analytics | null = null;

isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
        if (import.meta.env.DEV) {
            console.log("📊 Firebase Analytics inicializado de forma segura.");
        }
    }
});

if (import.meta.env.DEV) {
    console.log(`🔥 Firebase conectado: ${firebaseConfig.projectId}`);
}