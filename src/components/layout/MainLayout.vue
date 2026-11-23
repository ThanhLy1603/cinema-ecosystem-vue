<script setup lang="ts">
import { RouterLink, RouterView, useRouter, type Router } from 'vue-router';
import { logout } from '@/api/auth/authApi';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import { useAuthStore } from '@/stores/useAuthStore';

const router: Router = useRouter();
const authStore = useAuthStore();

async function handleLogout(): Promise<void> {
   try {
      await logout();
   } finally {
      authStore.logout();
      await router.push({ name: 'home' });
   }
}
</script>

<template>
   <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header class="border-b border-slate-200 bg-white">
         <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <RouterLink :to="{ name: 'home' }" class="text-lg font-bold text-emerald-700">Cinema Ecosystem</RouterLink>
            <div v-if="authStore.user" class="flex items-center gap-3 text-sm">
               <span class="hidden text-right sm:block">
                  <span class="block font-medium">{{ authStore.user.fullName }}</span>
                  <span class="block text-xs text-slate-500">{{ getPrimaryRoleLabel(authStore.user) }}</span>
               </span>
               <button
                  type="button"
                  class="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                  @click="handleLogout"
               >
                  Đăng xuất
               </button>
            </div>
            <RouterLink
               v-else
               :to="{ name: 'login' }"
               class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
               Đăng nhập
            </RouterLink>
         </div>
      </header>
      <main class="flex-1">
         <RouterView />
      </main>
      <footer class="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
         Cinema Ecosystem
      </footer>
   </div>
</template>
