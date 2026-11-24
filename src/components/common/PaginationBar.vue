<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

interface PaginationBarProps {
   page: number;
   totalPages: number;
   totalElements: number;
}

const props = defineProps<PaginationBarProps>();

const emit = defineEmits<{ pageChange: [page: number] }>();

const lastPage = computed<number>(() => Math.max(props.totalPages - 1, 0));
const displayedTotalPages = computed<number>(() => Math.max(props.totalPages, 1));
const formattedTotalElements = computed<string>(() => props.totalElements.toLocaleString('vi-VN'));

function goToPreviousPage(): void {
   emit('pageChange', props.page - 1);
}

function goToNextPage(): void {
   emit('pageChange', props.page + 1);
}
</script>

<template>
   <nav aria-label="Phân trang" class="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-600">
      <p>
         Trang <strong class="text-ink-900">{{ page + 1 }}</strong> / {{ displayedTotalPages }}
         <span class="mx-1 text-ink-300" aria-hidden="true">|</span>
         {{ formattedTotalElements }} kết quả
      </p>
      <div class="flex gap-2">
         <BaseButton variant="secondary" size="sm" :icon="ChevronLeft" :disabled="page <= 0" @click="goToPreviousPage">
            Trước
         </BaseButton>
         <BaseButton
            variant="secondary"
            size="sm"
            :icon="ChevronRight"
            :disabled="page >= lastPage"
            @click="goToNextPage"
         >
            Sau
         </BaseButton>
      </div>
   </nav>
</template>
