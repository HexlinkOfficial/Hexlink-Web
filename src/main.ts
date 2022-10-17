import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import { getAuth, type User } from 'firebase/auth'
import { app } from '@/services/firebase'

import { useAuthStore } from "@/stores/auth"
import { getIdTokenAndSetClaimsIfNecessary } from '@/services/auth'
import { clearUrqlClient } from '@/services/graphql/urql'
import { getUser } from "@/services/graphql/user"
import { genWalletAddress } from './services/web3/wallet'
import { createInitialUser } from '@/services/graphql/user'

let vueApp: any;
getAuth(app).onAuthStateChanged(async (user: any) => {
  
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  if (!vueApp) {
    vueApp = createApp(AppVue)
      .use(router)
      .use(pinia)
      .use(Antd)
      .mount('#app');
  }

  if (user) {
    // no-op
  } else {
    const store = useAuthStore();
    clearUrqlClient();
    store.signOut();
  }
});

