<script setup lang="ts">
import { Building2, LayoutDashboard, type LucideIcon } from 'lucide-vue-next';
import { RouterLink, RouterView } from 'vue-router';
import BrandLogo from '@/components/brand/BrandLogo.vue';

interface AdminNavItem {
   label: string;
   to: string;
   icon: LucideIcon;
   exact: boolean;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
   { label: 'Tổng quan', to: '/admin', icon: LayoutDashboard, exact: true },
   { label: 'Cụm rạp', to: '/admin/cinemas', icon: Building2, exact: false },
];

const NAV_LINK_CLASS: string =
   'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700';
const NAV_LINK_ACTIVE_CLASS: string = 'bg-brand-50 text-brand-700';
</script>

<template>
   <div class="flex min-h-dvh flex-col bg-cream text-ink-900">
      <header class="sticky top-0 z-40 border-b border-ink-200 bg-white">
         <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
            <div class="flex min-w-0 items-center gap-6">
               <div class="flex items-center gap-3">
                  <BrandLogo to="/admin" />
                  <span
                     class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200"
                  >
                     Quản trị
                  </span>
               </div>
               <nav aria-label="Điều hướng quản trị" class="flex items-center gap-1">
                  <RouterLink
                     v-for="adminNavItem in ADMIN_NAV_ITEMS"
                     :key="adminNavItem.to"
                     :to="adminNavItem.to"
                     :class="NAV_LINK_CLASS"
                     :active-class="adminNavItem.exact ? undefined : NAV_LINK_ACTIVE_CLASS"
                     :exact-active-class="NAV_LINK_ACTIVE_CLASS"
                  >
                     <component :is="adminNavItem.icon" class="size-4" aria-hidden="true" />
                     {{ adminNavItem.label }}
                  </RouterLink>
               </nav>
            </div>
            <RouterLink
               to="/"
               class="whitespace-nowrap text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
            >
               Về trang khách hàng
            </RouterLink>
         </div>
      </header>
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
         <RouterView />
      </main>
   </div>
</template>
