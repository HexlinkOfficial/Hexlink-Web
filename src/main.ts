import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/main.css'

import { getAuth} from 'firebase/auth'
import { app } from '@/services/firebase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { signOutFirebase } from "@/services/auth"
import { clearUrqlClient } from '@/services/graphql/urql'
import Toaster from '@meforma/vue-toaster';
import VueClipboard from 'vue-clipboard2';

let vueApp: any;
getAuth(app).onAuthStateChanged(async (user: any) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);

  VueClipboard.config.autoSetContainer = true
  if (!vueApp) {
    vueApp = createApp(AppVue)
      .use(router)
      .use(pinia)
      .use(Antd)
      .use(Toaster)
      .use(VueClipboard)
      .component('font-awesome-icon', FontAwesomeIcon)
      .mount('#app');
  }

  if (user) {
    // no-op
  } else {
    clearUrqlClient();
    signOutFirebase();
  }
});

