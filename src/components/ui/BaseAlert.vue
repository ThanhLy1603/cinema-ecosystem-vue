<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/common/utils';

interface AlertProps {
   variant?: 'error' | 'success' | 'info';
}

const props = withDefaults(defineProps<AlertProps>(), { variant: 'info' });

const VARIANT_CLASSES: Record<'error' | 'success' | 'info', string> = {
   error: 'border-red-200 bg-red-50 text-red-700',
   success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
   info: 'border-sky-200 bg-sky-50 text-sky-700',
};

const alertClass = computed<string>(() => cn('rounded-lg border px-3 py-2.5 text-sm', VARIANT_CLASSES[props.variant]));
</script>

<template>
   <div :class="alertClass" :role="variant === 'error' ? 'alert' : 'status'">
      <slot />
   </div>
</template>
