<script setup lang="ts">
interface SectionCardProps {
   title: string;
   description?: string;
}

withDefaults(defineProps<SectionCardProps>(), { description: undefined });
</script>

<template>
   <section class="rounded-lg bg-white shadow-card ring-1 ring-ink-200/80">
      <div class="border-b border-ink-100 px-5 py-3.5">
         <h2 class="text-[15px] font-semibold text-ink-900">{{ title }}</h2>
         <p v-if="description" class="mt-0.5 text-[13px] text-ink-500">{{ description }}</p>
      </div>
      <div class="p-5">
         <slot />
      </div>
   </section>
</template>
