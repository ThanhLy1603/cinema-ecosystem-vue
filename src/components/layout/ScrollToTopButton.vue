<script setup lang="ts">
import { ChevronUp } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const SHOW_AFTER_SCROLL_PX: number = 480;

const isVisible = ref<boolean>(false);

function handleScroll(): void {
   isVisible.value = window.scrollY > SHOW_AFTER_SCROLL_PX;
}

function scrollToTop(): void {
   window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted((): void => {
   handleScroll();
   window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount((): void => {
   window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
   <button
      v-if="isVisible"
      type="button"
      aria-label="Lên đầu trang"
      class="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-brand-600 text-white shadow-glow transition-all hover:-translate-y-1 hover:bg-brand-700"
      @click="scrollToTop"
   >
      <ChevronUp class="size-6" aria-hidden="true" />
   </button>
</template>
