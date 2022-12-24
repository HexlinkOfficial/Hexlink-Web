import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import NFTView from '@/views/NFTView.vue'
import Error404 from '@/views/Error404.vue'
import Transaction from '@/views/TransactionView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/newWallet.vue')
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/activities',
      name: 'activities',
      component: ActivitiesView
    },
    {
      path: '/collectible',
      name: 'collectible',
      component: NFTView
    },
    {
      path: '/transactions',
      name: 'transaction page',
      component: Transaction
    },
    {
      path: '/testabout',
      name: 'test aboutpage',
      component: () => import('@/views/newAbout.vue')
    },
    {
      path: '/oldhome',
      name: 'old homepage',
      component: HomeView
    },
    {
      path: '/adminView',
      name: 'admin view',
      component: () => import('@/views/AdminView.vue')
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
