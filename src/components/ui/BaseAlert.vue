<script setup lang="ts">
import { CircleAlert, CircleCheck, Info } from 'lucide-vue-next';
import { computed, type Component } from 'vue';
import { cn } from '@/lib/common/utils';

type AlertVariant = 'error' | 'success' | 'info';

interface BaseAlertProps {
   variant?: AlertVariant;
}

const props = withDefaults(defineProps<BaseAlertProps>(), { variant: 'info' });

const VARIANT_CLASSES: Record<AlertVariant, string> = {
   error: 'border-danger-200 bg-danger-50 text-danger-800',
   success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
   info: 'border-accent-200 bg-accent-50 text-ink-800',
};

const VARIANT_ICONS: Record<AlertVariant, Component> = {
   error: CircleAlert,
   success: CircleCheck,
   info: Info,
};

const alertClass = computed<string>(() =>
   cn('flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm font-medium', VARIANT_CLASSES[props.variant]),
);
</script>

<template>
   <div :role="variant === 'error' ? 'alert' : 'status'" :class="alertClass">
      <component :is="VARIANT_ICONS[variant]" class="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
      <div class="leading-relaxed">
         <slot />
      </div>
   </div>
</template>
