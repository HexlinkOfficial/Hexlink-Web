import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'
import Error404 from '@/views/Error404.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/TokenView.vue')
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/adminView',
      name: 'admin view',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/airdrop',
      name: 'red pockets view',
      component: () => import('@/views/RedPacketsView.vue')
    },
    {
      path: '/airdrop/share/:id',
      name: 'airdrop claim QR code',
      component: () => import('@/views/AirdropShare.vue')
    },
    {
      path: '/activities',
      name: 'activity view',
      component: () => import('@/views/ActivityView.vue')
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

  if (to.path == '/signin' && auth.authenticated) {
    return "/";
  }

  if (authRequired && !auth.authenticated) {
    auth.setReturnUrl(to.fullPath);
    return '/signin';
  }
});

export default router
