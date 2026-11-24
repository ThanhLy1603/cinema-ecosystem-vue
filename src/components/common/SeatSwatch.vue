<script setup lang="ts">
import { computed } from 'vue';
import {
   EMPTY_CELL_CLASS_NAME,
   SEAT_CELL_HEIGHT,
   getSeatWidth,
   type SeatStateVariant,
   type SeatVisualState,
} from '@/lib/cinema/seatMap';
import SeatIcon from './SeatIcon.vue';

interface SeatSwatchProps {
   seatTypeCode?: string;
   span?: number;
   variant?: SeatStateVariant | 'seat' | 'empty';
}

const props = withDefaults(defineProps<SeatSwatchProps>(), { seatTypeCode: 'STANDARD', span: 1, variant: 'seat' });

const SWATCH_SCALE: number = 0.7;
const SWATCH_PADDING: number = 2;

const seatWidth = computed<number>(() => getSeatWidth(props.span));
const visualState = computed<SeatVisualState>(() =>
   props.variant === 'seat' || props.variant === 'empty' ? 'available' : props.variant,
);
const viewBox = computed<string>(
   () => `0 0 ${seatWidth.value + SWATCH_PADDING * 2} ${SEAT_CELL_HEIGHT + SWATCH_PADDING * 2}`,
);
</script>

<template>
   <svg
      :width="(seatWidth + SWATCH_PADDING * 2) * SWATCH_SCALE"
      :height="(SEAT_CELL_HEIGHT + SWATCH_PADDING * 2) * SWATCH_SCALE"
      :viewBox="viewBox"
      aria-hidden="true"
   >
      <rect
         v-if="variant === 'empty'"
         :x="SWATCH_PADDING"
         :y="SWATCH_PADDING"
         :width="seatWidth"
         :height="SEAT_CELL_HEIGHT"
         :rx="8"
         stroke-width="1.5"
         stroke-dasharray="3 3"
         :class="EMPTY_CELL_CLASS_NAME"
      />
      <SeatIcon
         v-else
         :x="SWATCH_PADDING"
         :y="SWATCH_PADDING"
         :width="seatWidth"
         :seat-type-code="seatTypeCode"
         :visual-state="visualState"
      />
   </svg>
</template>
