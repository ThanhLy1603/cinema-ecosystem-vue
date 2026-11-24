import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

const SCROLL_THRESHOLD_PIXELS: number = 8;

export function useScrolled(): Ref<boolean> {
   const isScrolled = ref<boolean>(false);

   function handleScroll(): void {
      isScrolled.value = window.scrollY > SCROLL_THRESHOLD_PIXELS;
   }

   onMounted((): void => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
   });

   onBeforeUnmount((): void => {
      window.removeEventListener('scroll', handleScroll);
   });

   return isScrolled;
}
