import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import NFTView from '@/views/NFTView.vue'
import Error404 from '@/views/Error404.vue'
import newHome from '@/views/newHome.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/testhome',
      name: 'test homepage',
      component: newHome
    },
    {
      path: '/testabout',
      name: 'test aboutpage',
      component: () => import('@/views/newAbout.vue')
    },
    {
      path: '/testwallet',
      name: 'test walletpage',
      component: () => import('@/views/newWallet.vue')
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
