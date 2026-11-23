import { defineStore } from 'pinia';
import type { User, UserRole } from '@/types/auth/auth';

interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
   state: (): AuthState => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
   }),

   actions: {
      setAuth(user: User): void {
         this.user = user;
         this.isAuthenticated = true;
         this.isLoading = false;
      },

      setUser(user: User | null): void {
         this.user = user;
      },

      setLoading(isLoading: boolean): void {
         this.isLoading = isLoading;
      },

      logout(): void {
         this.user = null;
         this.isAuthenticated = false;
         this.isLoading = false;
      },

      hasRole(userRole: UserRole): boolean {
         return Boolean(this.user?.roles?.includes(userRole));
      },
   },
});
