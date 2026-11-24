<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/common/utils';
import type { CinemaStatus, HallStatus } from '@/types/cinema/cinema';
import { CINEMA_STATUS_LABELS, HALL_STATUS_LABELS } from '../utils/labels';

interface CinemaStatusBadgeProps {
   cinemaStatus?: CinemaStatus;
   hallStatus?: HallStatus;
   isDeleted?: boolean;
}

const props = withDefaults(defineProps<CinemaStatusBadgeProps>(), {
   cinemaStatus: undefined,
   hallStatus: undefined,
   isDeleted: false,
});

const STATUS_CLASSES: Record<CinemaStatus | HallStatus, string> = {
   ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
   INACTIVE: 'bg-amber-50 text-ink-800 ring-amber-200',
   MAINTENANCE: 'bg-amber-50 text-ink-800 ring-amber-200',
};

const status = computed<CinemaStatus | HallStatus | undefined>(() => props.cinemaStatus ?? props.hallStatus);
const label = computed<string>(() => {
   if (props.cinemaStatus) {
      return CINEMA_STATUS_LABELS[props.cinemaStatus];
   }
   return props.hallStatus ? HALL_STATUS_LABELS[props.hallStatus] : '';
});
const badgeClass = computed<string>(() =>
   cn(
      'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
      status.value ? STATUS_CLASSES[status.value] : '',
   ),
);
</script>

<template>
   <span
      v-if="isDeleted"
      class="inline-flex items-center whitespace-nowrap rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-500 ring-1 ring-ink-200"
   >
      Đã xóa
   </span>
   <span v-else-if="status" :class="badgeClass">{{ label }}</span>
</template>
