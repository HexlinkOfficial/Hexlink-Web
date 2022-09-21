import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics } from 'firebase/analytics'

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

if (import.meta.env.VITE_ENVIRONMENT !== 'production') {
    console.log('Using firebase: ' + import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
    console.log('Use emulator: ', import.meta.env.VITE_USE_FUNCTIONS_EMULATOR)
}

if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
    connectFunctionsEmulator(getFunctions(app), 'localhost', 5001)
}

const storage = getStorage(app)
export default storage
