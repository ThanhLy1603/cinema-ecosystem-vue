<script setup lang="ts">
import { computed } from 'vue';
import { SEAT_STATE_LABELS, formatSurcharge, type SeatStateVariant } from '@/lib/cinema/seatMap';
import type { SeatType } from '@/types/cinema/cinema';
import SeatSwatch from './SeatSwatch.vue';

interface SeatLegendProps {
   seatTypes: SeatType[];
   showMaintenance?: boolean;
   showEmptyCell?: boolean;
   bookingStates?: SeatStateVariant[];
}

const props = withDefaults(defineProps<SeatLegendProps>(), {
   showMaintenance: false,
   showEmptyCell: false,
   bookingStates: () => [],
});

const stateVariants = computed<SeatStateVariant[]>(() =>
   props.showMaintenance ? ['maintenance', ...props.bookingStates] : props.bookingStates,
);
</script>

<template>
   <ul class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-600">
      <li v-for="seatType in seatTypes" :key="seatType.code" class="flex items-center gap-2">
         <SeatSwatch :seat-type-code="seatType.code" :span="seatType.span" />
         <span>
            <strong class="font-semibold text-ink-800">{{ seatType.name }}</strong>
            <span class="ml-1 text-ink-500">{{ formatSurcharge(seatType.defaultSurcharge) }}</span>
         </span>
      </li>
      <li v-for="stateVariant in stateVariants" :key="stateVariant" class="flex items-center gap-2">
         <SeatSwatch :variant="stateVariant" />
         <span class="font-semibold text-ink-800">{{ SEAT_STATE_LABELS[stateVariant] }}</span>
      </li>
      <li v-if="showEmptyCell" class="flex items-center gap-2">
         <SeatSwatch variant="empty" />
         <span class="font-semibold text-ink-800">Lối đi / ô trống</span>
      </li>
   </ul>
</template>
