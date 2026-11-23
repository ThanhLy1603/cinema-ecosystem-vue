<script setup lang="ts">
import { computed, useId } from 'vue';
import { cn } from '@/lib/common/utils';

interface TextFieldProps {
   label: string;
   type?: string;
   error?: string;
   autocomplete?: string;
   placeholder?: string;
}

const props = withDefaults(defineProps<TextFieldProps>(), {
   type: 'text',
   error: '',
   autocomplete: 'off',
   placeholder: '',
});

const modelValue = defineModel<string>({ required: true });
const inputId: string = useId();

const inputClass = computed<string>(() =>
   cn(
      'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2',
      props.error
         ? 'border-red-400 focus:ring-red-200'
         : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200',
   ),
);
</script>

<template>
   <div class="flex flex-col gap-1.5">
      <label :for="inputId" class="text-sm font-medium text-slate-700">{{ label }}</label>
      <input
         :id="inputId"
         v-model="modelValue"
         :type="type"
         :autocomplete="autocomplete"
         :placeholder="placeholder"
         :aria-invalid="error !== ''"
         :class="inputClass"
      />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
   </div>
</template>
