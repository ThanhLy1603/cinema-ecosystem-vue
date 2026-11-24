<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import {
   EMPTY_CELL_CLASS_NAME,
   SEAT_CELL_HEIGHT,
   SEAT_CELL_PITCH_X,
   SEAT_CELL_PITCH_Y,
   SEAT_CELL_WIDTH,
   SEAT_LABEL_WIDTH,
   SEAT_SCREEN_HEIGHT,
   SEAT_STATE_FILLS,
   getCellX,
   getCellY,
   getGridHeight,
   getGridWidth,
   getRowIndex,
   getSeatLabel,
   getSeatWidth,
   type GridCell,
   type GridSeat,
   type SeatVisualState,
} from '@/lib/cinema/seatMap';
import { cn } from '@/lib/common/utils';
import SeatIcon from './SeatIcon.vue';

interface SeatGridProps {
   rows: string[];
   columns: number;
   seats: GridSeat[];
   gridLabel: string;
   showEmptyCells?: boolean;
   isEditable?: boolean;
   showSeatLabels?: boolean;
}

const props = withDefaults(defineProps<SeatGridProps>(), {
   showEmptyCells: false,
   isEditable: false,
   showSeatLabels: true,
});

const emit = defineEmits<{
   cellPointerDown: [gridCell: GridCell];
   cellPointerMove: [gridCell: GridCell];
   pointerEnd: [];
   rowLabelClick: [row: string];
   columnLabelClick: [column: number];
}>();

const MIN_GRID_WIDTH: number = 520;
const MIN_TOUCH_SCALE: number = 0.6;
const SCREEN_COLOR: string = SEAT_STATE_FILLS.selected;

const screenGlowId: string = `screen-glow-${useId()}`;
const svgElement = ref<SVGSVGElement | null>(null);
const lastCellKey = ref<string | null>(null);
const isDragging = ref<boolean>(false);

const gridWidth = computed<number>(() => getGridWidth(props.columns));
const gridHeight = computed<number>(() => getGridHeight(props.rows.length));
const svgStyle = computed<Record<string, string>>(() => ({
   minWidth: `${Math.min(gridWidth.value, Math.max(MIN_GRID_WIDTH, gridWidth.value * MIN_TOUCH_SCALE))}px`,
   maxWidth: `${gridWidth.value * 1.6}px`,
}));
const svgClass = computed<string>(() =>
   cn('mx-auto block h-auto w-full select-none', props.isEditable && 'cursor-crosshair touch-none'),
);
const occupiedCellKeys = computed<Set<string>>(() => {
   const cellKeys: Set<string> = new Set<string>();
   for (const gridSeat of props.seats) {
      for (let column: number = gridSeat.number; column < gridSeat.number + gridSeat.span; column += 1) {
         cellKeys.add(`${gridSeat.row}:${column}`);
      }
   }
   return cellKeys;
});
const emptyCells = computed<GridCell[]>(() => {
   if (!props.showEmptyCells) {
      return [];
   }
   const gridCells: GridCell[] = [];
   for (const row of props.rows) {
      for (let column: number = 1; column <= props.columns; column += 1) {
         if (!occupiedCellKeys.value.has(`${row}:${column}`)) {
            gridCells.push({ row, column });
         }
      }
   }
   return gridCells;
});
const columnNumbers = computed<number[]>(() => Array.from({ length: props.columns }, (_, index) => index + 1));
const labelledRows = computed<string[]>(() => {
   if (props.showEmptyCells) {
      return props.rows;
   }
   const rowsWithSeats: Set<string> = new Set(props.seats.map((gridSeat) => gridSeat.row));
   return props.rows.filter((row) => rowsWithSeats.has(row));
});
const screenOutlinePath = computed<string>(
   () => `M ${SEAT_LABEL_WIDTH} 22 Q ${gridWidth.value / 2} 0 ${gridWidth.value - SEAT_LABEL_WIDTH} 22`,
);
const screenGlowPath = computed<string>(
   () =>
      `${screenOutlinePath.value} L ${gridWidth.value - SEAT_LABEL_WIDTH} 50 Q ${gridWidth.value / 2} 28 ${SEAT_LABEL_WIDTH} 50 Z`,
);

function getSeatCaption(gridSeat: GridSeat): string {
   return gridSeat.span > 1 ? `${gridSeat.number}-${gridSeat.number + gridSeat.span - 1}` : String(gridSeat.number);
}

function getVisualState(gridSeat: GridSeat): SeatVisualState {
   if (gridSeat.visualState) {
      return gridSeat.visualState;
   }
   return gridSeat.status === 'MAINTENANCE' ? 'maintenance' : 'available';
}

function resolveCell(pointerEvent: PointerEvent): GridCell | null {
   const element: SVGSVGElement | null = svgElement.value;
   if (!element) {
      return null;
   }
   const boundingClientRect: DOMRect = element.getBoundingClientRect();
   const scale: number = gridWidth.value / boundingClientRect.width;
   const x: number = (pointerEvent.clientX - boundingClientRect.left) * scale;
   const y: number = (pointerEvent.clientY - boundingClientRect.top) * scale;
   const column: number = Math.floor((x - SEAT_LABEL_WIDTH) / SEAT_CELL_PITCH_X) + 1;
   const rowIndex: number = Math.floor((y - SEAT_SCREEN_HEIGHT) / SEAT_CELL_PITCH_Y);
   if (column < 1 || column > props.columns || rowIndex < 0 || rowIndex >= props.rows.length) {
      return null;
   }
   const row: string | undefined = props.rows[rowIndex];
   return row === undefined ? null : { row, column };
}

function handlePointerDown(pointerEvent: PointerEvent): void {
   if (!props.isEditable || pointerEvent.button !== 0) {
      return;
   }
   const gridCell: GridCell | null = resolveCell(pointerEvent);
   if (!gridCell) {
      return;
   }
   svgElement.value?.setPointerCapture(pointerEvent.pointerId);
   isDragging.value = true;
   lastCellKey.value = `${gridCell.row}:${gridCell.column}`;
   emit('cellPointerDown', gridCell);
}

function handlePointerMove(pointerEvent: PointerEvent): void {
   if (!isDragging.value) {
      return;
   }
   const gridCell: GridCell | null = resolveCell(pointerEvent);
   if (!gridCell) {
      return;
   }
   const cellKey: string = `${gridCell.row}:${gridCell.column}`;
   if (cellKey === lastCellKey.value) {
      return;
   }
   lastCellKey.value = cellKey;
   emit('cellPointerMove', gridCell);
}

function handlePointerEnd(pointerEvent: PointerEvent): void {
   if (!isDragging.value) {
      return;
   }
   isDragging.value = false;
   lastCellKey.value = null;
   if (svgElement.value?.hasPointerCapture(pointerEvent.pointerId)) {
      svgElement.value.releasePointerCapture(pointerEvent.pointerId);
   }
   emit('pointerEnd');
}

function stopPointerPropagation(pointerEvent: PointerEvent): void {
   pointerEvent.stopPropagation();
}

function handleRowLabelClick(row: string): void {
   emit('rowLabelClick', row);
}

function handleColumnLabelClick(column: number): void {
   emit('columnLabelClick', column);
}
</script>

<template>
   <div class="overflow-x-auto">
      <svg
         ref="svgElement"
         role="img"
         :aria-label="gridLabel"
         :viewBox="`0 0 ${gridWidth} ${gridHeight}`"
         :class="svgClass"
         :style="svgStyle"
         @pointerdown="handlePointerDown"
         @pointermove="handlePointerMove"
         @pointerup="handlePointerEnd"
         @pointercancel="handlePointerEnd"
      >
         <defs>
            <linearGradient :id="screenGlowId" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" :stop-color="SCREEN_COLOR" stop-opacity="0.35" />
               <stop offset="100%" :stop-color="SCREEN_COLOR" stop-opacity="0" />
            </linearGradient>
         </defs>
         <path :d="screenGlowPath" :fill="`url(#${screenGlowId})`" />
         <path :d="screenOutlinePath" fill="none" :stroke="SCREEN_COLOR" stroke-width="4" stroke-linecap="round" />
         <text :x="gridWidth / 2" :y="42" text-anchor="middle" class="fill-ink-400 text-[13px] font-bold">
            Màn hình
         </text>

         <rect
            v-for="emptyCell in emptyCells"
            :key="`empty-${emptyCell.row}-${emptyCell.column}`"
            :x="getCellX(emptyCell.column)"
            :y="getCellY(getRowIndex(emptyCell.row))"
            :width="SEAT_CELL_WIDTH"
            :height="SEAT_CELL_HEIGHT"
            :rx="8"
            stroke-dasharray="3 3"
            :class="EMPTY_CELL_CLASS_NAME"
         />

         <text
            v-for="row in labelledRows"
            :key="`row-${row}`"
            :x="SEAT_LABEL_WIDTH / 2"
            :y="getCellY(getRowIndex(row)) + SEAT_CELL_HEIGHT / 2 + 4"
            text-anchor="middle"
            :class="cn('fill-ink-500 text-[12px] font-bold', isEditable && 'cursor-pointer hover:fill-brand-600')"
            @pointerdown="stopPointerPropagation"
            @click="handleRowLabelClick(row)"
         >
            {{ row }}
         </text>

         <template v-if="isEditable">
            <text
               v-for="column in columnNumbers"
               :key="`column-${column}`"
               :x="getCellX(column) + SEAT_CELL_WIDTH / 2"
               :y="gridHeight - 8"
               text-anchor="middle"
               class="cursor-pointer fill-ink-400 text-[10px] font-semibold hover:fill-brand-600"
               @pointerdown="stopPointerPropagation"
               @click="handleColumnLabelClick(column)"
            >
               {{ column }}
            </text>
         </template>

         <g
            v-for="gridSeat in seats"
            :key="getSeatLabel(gridSeat.row, gridSeat.number)"
            :aria-label="`Ghế ${getSeatLabel(gridSeat.row, gridSeat.number)}`"
         >
            <title v-if="gridSeat.tooltip">{{ gridSeat.tooltip }}</title>
            <SeatIcon
               :x="getCellX(gridSeat.number)"
               :y="getCellY(getRowIndex(gridSeat.row))"
               :width="getSeatWidth(gridSeat.span)"
               :seat-type-code="gridSeat.type"
               :visual-state="getVisualState(gridSeat)"
               :label="showSeatLabels ? getSeatCaption(gridSeat) : undefined"
            />
         </g>
      </svg>
   </div>
</template>
