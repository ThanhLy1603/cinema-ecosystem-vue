<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { getPublicSeatLayout } from '@/api/cinema/cinemaApi';
import SeatGrid from '@/components/common/SeatGrid.vue';
import SeatLegend from '@/components/common/SeatLegend.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { publicSeatLayoutKey } from '@/lib/cinema/cinemaQueryKeys';
import { getLayoutRowLetters } from '@/lib/cinema/seatMap';
import { useSeatTypes } from '@/lib/cinema/useSeatTypes';
import { getErrorMessage } from '@/lib/common/apiError';
import type { SeatLayout, SeatType } from '@/types/cinema/cinema';

interface HallSeatPreviewProps {
   hallId: number;
}

const props = defineProps<HallSeatPreviewProps>();

const { data: seatTypesData, isPending: isSeatTypesPending } = useSeatTypes();
const {
   data: seatLayout,
   isPending: isSeatLayoutPending,
   isError,
   error,
} = useQuery<SeatLayout>({
   queryKey: computed(() => publicSeatLayoutKey(props.hallId)),
   queryFn: () => getPublicSeatLayout(props.hallId),
});

const seatTypes = computed<SeatType[]>(() => seatTypesData.value ?? []);
const rowLetters = computed<string[]>(() => getLayoutRowLetters(seatLayout.value?.rows ?? []));
const hasMaintenanceSeats = computed<boolean>(
   () => seatLayout.value?.seats.some((seat) => seat.status === 'MAINTENANCE') ?? false,
);

function countSeatsByType(seatType: SeatType): number {
   return seatLayout.value?.seats.filter((seat) => seat.type === seatType.code).length ?? 0;
}
</script>

<template>
   <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
   <p v-else-if="isSeatLayoutPending || isSeatTypesPending" class="py-10 text-center text-sm text-ink-500">
      Đang tải sơ đồ ghế...
   </p>
   <p v-else-if="seatLayout && seatLayout.seats.length === 0" class="py-10 text-center text-sm text-ink-500">
      Phòng chiếu này chưa có sơ đồ ghế.
   </p>
   <div v-else-if="seatLayout" class="space-y-5">
      <SeatGrid
         :rows="rowLetters"
         :columns="seatLayout.columns"
         :seats="seatLayout.seats"
         :grid-label="`Sơ đồ ghế ${seatLayout.hallName}`"
      />
      <SeatLegend :seat-types="seatTypes" :show-maintenance="hasMaintenanceSeats" />
      <p class="text-center text-sm text-ink-500">
         Tổng <strong class="text-ink-900">{{ seatLayout.seats.length }}</strong> ghế
         <template v-for="seatType in seatTypes" :key="seatType.code">
            <span class="mx-1 text-ink-300" aria-hidden="true">|</span>
            {{ countSeatsByType(seatType) }} {{ seatType.name.toLowerCase() }}
         </template>
      </p>
   </div>
</template>
