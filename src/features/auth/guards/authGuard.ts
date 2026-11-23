import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserRole } from '@/types/auth/auth';
import { initializeSession } from '../services/sessionService';
import { getPostLoginPath, getRedirectPath } from '../utils/redirect';

export async function authGuard(routeLocationNormalized: RouteLocationNormalized): Promise<true | RouteLocationRaw> {
   await initializeSession();
   const authStore = useAuthStore();

   if (routeLocationNormalized.meta.guestOnly && authStore.isAuthenticated) {
      return getPostLoginPath(getRedirectPath(routeLocationNormalized.query.redirect), authStore.user);
   }

   if (routeLocationNormalized.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: routeLocationNormalized.fullPath } };
   }

   const requiredRoles: UserRole[] | undefined = routeLocationNormalized.meta.roles;
   if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole: boolean = requiredRoles.some((userRole) => authStore.hasRole(userRole));
      if (!hasRequiredRole) {
         return { name: 'forbidden' };
      }
   }

   return true;
}
