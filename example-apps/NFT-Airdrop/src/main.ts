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
import Toaster from '@meforma/vue-toaster';
import { useAuthStore } from "@/stores/auth";

import urql from "@urql/vue";
import { createClient, defaultExchanges, subscriptionExchange } from '@urql/vue';
import { createClient as createWSClient } from 'graphql-ws';
import { clearUrqlClient } from '@/graphql/urql';

let vueApp: any;
const wsClient = createWSClient({
  url: import.meta.env.VITE_HASURA_WS_URL,
  options: {
      reconnect: true,
      connectionParams: () => ({
          headers: { authorization: `Bearer ${useAuthStore().user?.idToken}` }
      })
  }
});

const urqlClient = createClient( {
  url: import.meta.env.VITE_HASURA_URL,
  fetchOptions: () => {
      const idToken = useAuthStore().user?.idToken;
      return {
          headers: { authorization: `Bearer ${idToken}`},
      };
  },
  exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
          forwardSubscription(operation) {
            return {
              subscribe: (sink) => ({
                unsubscribe: wsClient.subscribe(operation, sink),
              }),
            }
          },
      }),
  ],
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

getAuth(app).onAuthStateChanged(async (user: any) => {
  if (!vueApp) {
    vueApp = createApp(AppVue)
      .use(router)
      .use(pinia)
      .use(Antd)
      .use(Toaster)
      .use(urql, urqlClient)
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

