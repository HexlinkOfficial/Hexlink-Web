import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

const pinia = createPinia();
createApp(AppVue)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app');