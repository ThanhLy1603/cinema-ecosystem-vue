<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { Component } from 'vue';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';

interface ComingSoonPageProps {
   title: string;
   description: string;
   icon: Component;
   backTo?: string;
   backLabel?: string;
}

withDefaults(defineProps<ComingSoonPageProps>(), { backTo: '/', backLabel: 'Về trang chủ' });
</script>

<template>
   <section class="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div class="space-y-6">
         <span
            class="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-accent-100 text-brand-600 shadow-card ring-1 ring-brand-100"
         >
            <component :is="icon" class="size-10" aria-hidden="true" />
         </span>
         <div class="space-y-2">
            <span
               class="inline-block rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-600"
            >
               Sắp ra mắt
            </span>
            <h1 class="text-3xl font-extrabold tracking-tight text-ink-900">{{ title }}</h1>
            <p class="mx-auto max-w-md text-ink-500">{{ description }}</p>
         </div>
         <BaseLinkButton :to="backTo" variant="secondary" :icon="ArrowLeft">{{ backLabel }}</BaseLinkButton>
      </div>
   </section>
</template>
