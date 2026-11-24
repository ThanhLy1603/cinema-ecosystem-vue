<script setup lang="ts">
import { computed } from 'vue';
import { getPasswordStrength } from '@/lib/auth/validation';
import { cn } from '@/lib/common/utils';

interface PasswordStrengthProps {
   password: string;
}

const props = defineProps<PasswordStrengthProps>();

const STRENGTH_LABELS: string[] = ['Quá yếu', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
const STRENGTH_BAR_CLASSES: string[] = [
   'bg-ink-200',
   'bg-danger-400',
   'bg-amber-400',
   'bg-amber-500',
   'bg-emerald-500',
];
const STRENGTH_TEXT_CLASSES: string[] = [
   'text-ink-400',
   'text-danger-600',
   'text-amber-600',
   'text-amber-600',
   'text-emerald-600',
];
const BAR_COUNT: number = 4;

const strength = computed<number>(() => getPasswordStrength(props.password));
</script>

<template>
   <div v-if="password.length > 0" class="space-y-1.5" aria-live="polite">
      <div class="flex gap-1.5">
         <span
            v-for="barIndex in BAR_COUNT"
            :key="barIndex"
            :class="
               cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  barIndex - 1 < strength ? STRENGTH_BAR_CLASSES[strength] : 'bg-ink-100',
               )
            "
         />
      </div>
      <p :class="cn('text-xs font-semibold', STRENGTH_TEXT_CLASSES[strength])">
         Độ mạnh mật khẩu: {{ STRENGTH_LABELS[strength] }}
      </p>
   </div>
</template>
