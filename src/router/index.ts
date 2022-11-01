import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import NFTView from '@/views/NFTView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView,
    },
    {
      path: '/activities',
      name: 'activities',
      component: ActivitiesView,
    },
    {
      path: '/collectible',
      name: 'collectible',
      component: NFTView
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
