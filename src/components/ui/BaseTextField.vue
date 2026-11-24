<script setup lang="ts">
import { CircleAlert, Eye, EyeOff } from 'lucide-vue-next';
import { computed, onMounted, ref, type Component } from 'vue';
import { cn } from '@/lib/common/utils';

interface BaseTextFieldProps {
   id: string;
   label: string;
   type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'time';
   icon?: Component;
   error?: string;
   hint?: string;
   placeholder?: string;
   autocomplete?: string;
   disabled?: boolean;
   optional?: boolean;
   maxLength?: number;
   max?: string;
   autoFocus?: boolean;
   hideLabel?: boolean;
}

const props = withDefaults(defineProps<BaseTextFieldProps>(), {
   type: 'text',
   icon: undefined,
   error: undefined,
   hint: undefined,
   placeholder: undefined,
   autocomplete: undefined,
   disabled: false,
   optional: false,
   maxLength: undefined,
   max: undefined,
   autoFocus: false,
   hideLabel: false,
});

const modelValue = defineModel<string>({ required: true });
const inputElement = ref<HTMLInputElement | null>(null);
const isPasswordVisible = ref<boolean>(false);

const isPasswordField = computed<boolean>(() => props.type === 'password');
const inputType = computed<string>(() => (isPasswordField.value && isPasswordVisible.value ? 'text' : props.type));
const messageId = computed<string>(() => `${props.id}-message`);
const hasError = computed<boolean>(() => Boolean(props.error));

const inputClass = computed<string>(() =>
   cn(
      'h-10 w-full rounded-lg border bg-white text-sm text-ink-900 shadow-sm outline-none transition-colors placeholder:text-ink-300 disabled:bg-ink-50 disabled:text-ink-400',
      props.icon ? 'pl-10' : 'pl-3',
      isPasswordField.value ? 'pr-11' : 'pr-3',
      hasError.value
         ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-100'
         : 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
   ),
);

onMounted((): void => {
   if (props.autoFocus) {
      inputElement.value?.focus();
   }
});

function togglePasswordVisibility(): void {
   isPasswordVisible.value = !isPasswordVisible.value;
}
</script>

<template>
   <div class="space-y-1">
      <label
         :for="id"
         :class="
            cn('flex items-baseline justify-between text-[13px] font-semibold text-ink-700', hideLabel && 'sr-only')
         "
      >
         <span>{{ label }}</span>
         <span v-if="optional" class="text-xs font-normal text-ink-400">Không bắt buộc</span>
      </label>

      <div class="relative">
         <component
            :is="icon"
            v-if="icon"
            :class="
               cn(
                  'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors',
                  hasError ? 'text-danger-500' : 'text-ink-400',
               )
            "
            aria-hidden="true"
         />
         <input
            :id="id"
            ref="inputElement"
            v-model="modelValue"
            :name="id"
            :type="inputType"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :maxlength="maxLength"
            :max="max"
            :aria-invalid="hasError"
            :aria-describedby="error || hint ? messageId : undefined"
            :class="inputClass"
         />
         <button
            v-if="isPasswordField"
            type="button"
            :aria-label="isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            class="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            @click="togglePasswordVisibility"
         >
            <EyeOff v-if="isPasswordVisible" class="size-[18px]" />
            <Eye v-else class="size-[18px]" />
         </button>
      </div>

      <p
         v-if="error"
         :id="messageId"
         role="alert"
         class="flex items-center gap-1.5 text-[13px] font-medium text-danger-700"
      >
         <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
         {{ error }}
      </p>
      <p v-else-if="hint" :id="messageId" class="text-[13px] text-ink-500">{{ hint }}</p>
   </div>
</template>
