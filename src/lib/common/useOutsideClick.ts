import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useOutsideClick(containerRef: Ref<HTMLElement | null>, onDismiss: () => void): void {
   function handleMouseDown(mouseEvent: MouseEvent): void {
      const container: HTMLElement | null = containerRef.value;
      if (container && !container.contains(mouseEvent.target as Node)) {
         onDismiss();
      }
   }

   function handleKeyDown(keyboardEvent: KeyboardEvent): void {
      if (keyboardEvent.key === 'Escape') {
         onDismiss();
      }
   }

   onMounted((): void => {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleKeyDown);
   });

   onBeforeUnmount((): void => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
   });
}
