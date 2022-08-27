import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { initializeApp } from "firebase/app";

loadFonts()

const firebaseConfig = {
  apiKey: import.meta.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};
initializeApp(firebaseConfig);

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
