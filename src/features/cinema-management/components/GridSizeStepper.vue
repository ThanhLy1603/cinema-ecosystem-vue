<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';

interface GridSizeStepperProps {
   label: string;
   minimum: number;
   maximum: number;
}

defineProps<GridSizeStepperProps>();

const value = defineModel<number>({ required: true });

function decrease(): void {
   value.value -= 1;
}

function increase(): void {
   value.value += 1;
}
</script>

<template>
   <div class="flex items-center justify-between gap-3">
      <span class="text-sm font-semibold text-ink-800">{{ label }}</span>
      <div class="flex items-center gap-2">
         <button
            type="button"
            :aria-label="`Giảm ${label.toLowerCase()}`"
            :disabled="value <= minimum"
            class="grid size-9 place-items-center rounded-xl border border-ink-200 text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="decrease"
         >
            <Minus class="size-4" aria-hidden="true" />
         </button>
         <output :aria-label="label" class="w-8 text-center text-sm font-bold text-ink-900">{{ value }}</output>
         <button
            type="button"
            :aria-label="`Tăng ${label.toLowerCase()}`"
            :disabled="value >= maximum"
            class="grid size-9 place-items-center rounded-xl border border-ink-200 text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="increase"
         >
            <Plus class="size-4" aria-hidden="true" />
         </button>
      </div>
   </div>
</template>
