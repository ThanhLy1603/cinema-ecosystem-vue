<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import BrandLogo from '@/components/brand/BrandLogo.vue';
</script>

<template>
   <div class="flex min-h-dvh flex-col bg-cream text-ink-900">
      <header class="sticky top-0 z-40 border-b border-ink-200 bg-white">
         <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div class="flex items-center gap-3">
               <BrandLogo to="/admin" />
               <span
                  class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200"
               >
                  Quản trị
               </span>
            </div>
            <RouterLink to="/" class="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700">
               Về trang khách hàng
            </RouterLink>
         </div>
      </header>
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
         <RouterView />
      </main>
   </div>
</template>
