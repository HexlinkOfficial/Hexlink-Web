import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'
import Error404 from '@/views/Error404.vue'
import Transaction from '@/views/TransactionView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/AssetView.vue')
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/transactions',
      name: 'transaction page',
      component: Transaction
    },
    {
      path: '/adminView',
      name: 'admin view',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/redPacket2',
      name: 'red pocket view',
      component: () => import('@/views/RedPacketView2.vue')
    },
    {
      path: '/redPacket',
      name: 'red pocket view',
      component: () => import('@/views/RedPacketView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error404',
      component: Error404
    }
  ]
});

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/signin'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.authenticated) {
    auth.setReturnUrl(to.fullPath);
    return '/signin';
  }
});

export default router
