<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink, RouterView } from 'vue-router';
import BrandLogo from '@/components/brand/BrandLogo.vue';
import AuthShowcase from './AuthShowcase.vue';
</script>

<template>
   <div class="theme-shinkai grid min-h-dvh grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
      <AuthShowcase />

      <main class="relative flex min-w-0 flex-col bg-gradient-to-b from-cream to-sand/70">
         <div class="flex items-center justify-between px-6 py-5 sm:px-10">
            <div class="lg:hidden">
               <BrandLogo variant="cinema" />
            </div>
            <RouterLink
               to="/"
               class="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-ink-500 transition-colors hover:text-brand-700"
            >
               <ArrowLeft class="size-4" aria-hidden="true" />
               Về trang chủ
            </RouterLink>
         </div>

         <div class="flex flex-1 items-center justify-center px-6 pb-10 sm:px-10">
            <div class="w-full max-w-[460px] animate-fade-up">
               <RouterView />
            </div>
         </div>

         <p class="px-6 pb-6 text-center text-xs text-ink-400">© 2026 CinemaSphere</p>
      </main>
   </div>
</template>
