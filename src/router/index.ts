import { createRouter, createWebHistory, type Router } from 'vue-router';
import { authGuard } from '@/features/auth/guards/authGuard';
import { routes } from './routes';

const router: Router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior(): ScrollToOptions {
      return { top: 0 };
   },
});

router.beforeEach(authGuard);

export default router;
