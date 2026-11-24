<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getSeatMap } from '@/api/cinema/hallApi';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { useSeatTypes } from '@/lib/cinema/useSeatTypes';
import { getErrorMessage } from '@/lib/common/apiError';
import type { SeatLayout } from '@/types/cinema/cinema';
import CinemaStatusBadge from '../components/CinemaStatusBadge.vue';
import SeatMapEditor from '../components/SeatMapEditor.vue';
import { adminSeatMapKey } from '../utils/queryKeys';

const route = useRoute();
const hallId = computed<number>(() => Number(route.params.hallId));
const isValidHallId = computed<boolean>(() => Number.isInteger(hallId.value) && hallId.value > 0);

const {
   data: seatTypes,
   isPending: isSeatTypesPending,
   isError: isSeatTypesError,
   error: seatTypesError,
} = useSeatTypes();
const {
   data: seatLayout,
   isPending: isSeatMapPending,
   isError: isSeatMapError,
   error: seatMapError,
} = useQuery<SeatLayout>({
   queryKey: computed(() => adminSeatMapKey(hallId.value)),
   queryFn: () => getSeatMap(hallId.value),
   enabled: isValidHallId,
   gcTime: 0,
   staleTime: 0,
});

const isPending = computed<boolean>(() => isSeatMapPending.value || isSeatTypesPending.value);
const hasError = computed<boolean>(() => isSeatMapError.value || isSeatTypesError.value);
const errorMessage = computed<string>(() => getErrorMessage(seatMapError.value ?? seatTypesError.value));
</script>

<template>
   <div v-if="!isValidHallId" class="w-full max-w-3xl space-y-4">
      <BaseAlert variant="error">Mã phòng chiếu không hợp lệ.</BaseAlert>
      <RouterLink to="/admin/cinemas" class="text-sm font-semibold text-brand-700">Về danh sách cụm rạp</RouterLink>
   </div>

   <FullPageSpinner v-else-if="isPending" />

   <div v-else-if="hasError" class="w-full max-w-3xl space-y-4">
      <BaseAlert variant="error">{{ errorMessage }}</BaseAlert>
      <RouterLink to="/admin/cinemas" class="text-sm font-semibold text-brand-700">Về danh sách cụm rạp</RouterLink>
   </div>

   <div v-else-if="seatLayout && seatTypes" class="w-full max-w-6xl space-y-6">
      <RouterLink
         :to="`/admin/cinemas/${seatLayout.cinemaId}`"
         class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
      >
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về cụm rạp
      </RouterLink>
      <header class="flex flex-wrap items-center gap-3">
         <h1 class="text-xl font-semibold tracking-tight text-ink-900">Sơ đồ ghế phòng {{ seatLayout.hallName }}</h1>
         <span class="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold text-ink-700">
            {{ seatLayout.screenType }}
         </span>
         <CinemaStatusBadge :hall-status="seatLayout.hallStatus" />
      </header>
      <SeatMapEditor :key="seatLayout.hallId" :seat-layout="seatLayout" :seat-types="seatTypes" />
   </div>
</template>
