<script setup lang="ts">
interface PageBannerProps {
   title: string;
   description?: string;
   eyebrow?: string;
}

withDefaults(defineProps<PageBannerProps>(), { description: undefined, eyebrow: undefined });
</script>

<template>
   <section class="border-b border-ink-200 bg-white">
      <div class="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-12 lg:py-12">
         <div class="space-y-1.5">
            <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-widest text-brand-600">{{ eyebrow }}</p>
            <h1 class="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{{ title }}</h1>
            <p v-if="description" class="max-w-2xl text-sm text-ink-600">{{ description }}</p>
         </div>
         <slot />
      </div>
   </section>
</template>
