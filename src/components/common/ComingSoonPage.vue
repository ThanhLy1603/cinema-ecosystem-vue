<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface ComingSoonPageProps {
   title: string;
   description?: string;
   backTo?: RouteLocationRaw;
   backLabel?: string;
}

withDefaults(defineProps<ComingSoonPageProps>(), {
   description: 'Tính năng này đang được xây dựng.',
   backTo: () => ({ name: 'home' }),
   backLabel: 'Quay lại',
});
</script>

<template>
   <section class="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Sắp ra mắt</span>
      <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
      <p class="text-slate-600">{{ description }}</p>
      <RouterLink
         :to="backTo"
         class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
         {{ backLabel }}
      </RouterLink>
   </section>
</template>
