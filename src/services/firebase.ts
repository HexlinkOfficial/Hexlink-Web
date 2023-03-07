import { initializeApp } from '@firebase/app'
import { getAuth } from '@firebase/auth';
import { getStorage, connectStorageEmulator } from '@firebase/storage'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getAnalytics } from '@firebase/analytics'
import { connectAuthEmulator } from '@firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig)
export const googleAnalytics = getAnalytics(app)
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const auth = getAuth(app)

if (import.meta.env.VITE_ENVIRONMENT !== 'production') {
    console.log('Using firebase: ' + import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
    console.log('Use emulator: ', import.meta.env.VITE_USE_FUNCTIONS_EMULATOR)
}

if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectStorageEmulator(storage, "localhost", 9199);
    // connectAuthEmulator(auth, "http://localhost:9099");
}
