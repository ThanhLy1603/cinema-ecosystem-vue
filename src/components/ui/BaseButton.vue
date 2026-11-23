<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/common/utils';

interface ButtonProps {
   type?: 'button' | 'submit' | 'reset';
   variant?: 'primary' | 'secondary';
   isLoading?: boolean;
   disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
   type: 'button',
   variant: 'primary',
   isLoading: false,
   disabled: false,
});

const BASE_CLASS: string =
   'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANT_CLASSES: Record<'primary' | 'secondary', string> = {
   primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
   secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
};

const buttonClass = computed<string>(() => cn(BASE_CLASS, VARIANT_CLASSES[props.variant]));
</script>

<template>
   <button :type="type" :disabled="disabled || isLoading" :class="buttonClass">
      <span
         v-if="isLoading"
         class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
         aria-hidden="true"
      />
      <slot />
   </button>
</template>
