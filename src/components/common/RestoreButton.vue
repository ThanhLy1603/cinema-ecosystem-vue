<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { RotateCcw } from 'lucide-vue-next';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';

interface RestoreButtonProps {
   restore: () => Promise<unknown>;
}

const props = defineProps<RestoreButtonProps>();

const emit = defineEmits<{ restored: [] }>();

function handleRestored(): void {
   emit('restored');
}

const {
   mutate: submitRestore,
   isPending,
   isError,
   error,
} = useMutation<unknown, unknown, void>({
   mutationFn: (): Promise<unknown> => props.restore(),
   onSuccess: handleRestored,
});

function handleClick(): void {
   submitRestore();
}
</script>

<template>
   <div class="space-y-2">
      <BaseButton variant="secondary" class="h-9 px-3" :is-loading="isPending" :icon="RotateCcw" @click="handleClick">
         Khôi phục
      </BaseButton>
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
   </div>
</template>
