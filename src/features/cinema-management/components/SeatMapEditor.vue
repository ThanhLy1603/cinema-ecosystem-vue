<script setup lang="ts">
import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { Grid3x3, Redo2, RotateCcw, Save, Undo2 } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getSeatMap, getSeatMapLock, saveSeatMap } from '@/api/cinema/hallApi';
import SeatGrid from '@/components/common/SeatGrid.vue';
import SeatLegend from '@/components/common/SeatLegend.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import { MAX_SEAT_COLUMNS, MAX_SEAT_ROWS, buildRowLetters, type GridCell, type GridSeat } from '@/lib/cinema/seatMap';
import { getErrorCode, getErrorMessage } from '@/lib/common/apiError';
import { cn } from '@/lib/common/utils';
import type { SeatLayout, SeatMapLock, SeatType } from '@/types/cinema/cinema';
import type { SelectOption } from '@/types/common/selectOption';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { useSeatMapDraft, type SeatMapDraftController } from '../hooks/useSeatMapDraft';
import { adminSeatMapKey, adminSeatMapLockKey } from '../utils/queryKeys';
import {
   applyTool,
   applyToolToColumn,
   applyToolToRow,
   computeStatistics,
   createDraftFromLayout,
   createGridDraft,
   resizeDraft,
   serializeSeats,
   toGridSeats,
   toSeatCellRequests,
   type EditorTool,
   type SeatMapDraft,
   type SeatMapStatistics,
   type SeatTypesByCode,
} from '../utils/seatMapEditing';
import GridSizeStepper from './GridSizeStepper.vue';
import SeatToolPalette from './SeatToolPalette.vue';

interface SeatMapEditorProps {
   seatLayout: SeatLayout;
   seatTypes: SeatType[];
}

const props = defineProps<SeatMapEditorProps>();

const DEFAULT_GENERATE_ROWS: number = 10;
const DEFAULT_GENERATE_COLUMNS: number = 10;
const SEAT_MAP_CONFLICT_CODE: string = 'SEAT_MAP_CONFLICT';
const SEAT_MAP_LOCKED_CODE: string = 'SEAT_MAP_LOCKED';

function indexSeatTypes(seatTypes: SeatType[]): SeatTypesByCode {
   const seatTypesByCode: SeatTypesByCode = {};
   for (const seatType of seatTypes) {
      seatTypesByCode[seatType.code] = seatType;
   }
   return seatTypesByCode;
}

function preserveCanvasSize(loadedSeatMapDraft: SeatMapDraft, currentSeatMapDraft: SeatMapDraft): SeatMapDraft {
   return {
      ...loadedSeatMapDraft,
      rowCount: Math.max(loadedSeatMapDraft.rowCount, currentSeatMapDraft.rowCount),
      columns: Math.max(loadedSeatMapDraft.columns, currentSeatMapDraft.columns),
   };
}

const queryClient: QueryClient = useQueryClient();
const refreshCinema: () => void = useCinemaRefresh(props.seatLayout.cinemaId);
const seatTypesByCode = computed<SeatTypesByCode>(() => indexSeatTypes(props.seatTypes));
const savedLayout = ref<SeatLayout>(props.seatLayout);
const seatMapDraftController: SeatMapDraftController = useSeatMapDraft(createDraftFromLayout(props.seatLayout));
const seatMapDraft = seatMapDraftController.seatMapDraft;
const editorTool = ref<EditorTool>({ kind: 'seat', seatTypeCode: props.seatTypes[0]?.code ?? 'STANDARD' });
const generateRows = ref<number>(DEFAULT_GENERATE_ROWS);
const generateColumns = ref<number>(DEFAULT_GENERATE_COLUMNS);
const generateSeatTypeCode = ref<string>(props.seatTypes[0]?.code ?? '');
const generateError = ref<string | undefined>(undefined);

const baselineSerialized = computed<string>(() => serializeSeats(createDraftFromLayout(savedLayout.value)));
const isDirty = computed<boolean>(() => serializeSeats(seatMapDraft.value) !== baselineSerialized.value);

const { data: seatMapLock } = useQuery<SeatMapLock>({
   queryKey: adminSeatMapLockKey(props.seatLayout.hallId),
   queryFn: () => getSeatMapLock(props.seatLayout.hallId),
});
const isEditingLocked = computed<boolean>(() => seatMapLock.value?.locked ?? false);
const seatMapStatistics = computed<SeatMapStatistics>(() => computeStatistics(seatMapDraft.value));
const rowLetters = computed<string[]>(() => buildRowLetters(seatMapDraft.value.rowCount));
const gridSeats = computed<GridSeat[]>(() => toGridSeats(seatMapDraft.value, seatTypesByCode.value));
const seatTypeOptions = computed<SelectOption[]>(() =>
   props.seatTypes.map((seatType) => ({ value: seatType.code, label: seatType.name })),
);
const statisticsText = computed<string>(() =>
   seatMapStatistics.value.maintenanceSeats > 0 ? `, ${seatMapStatistics.value.maintenanceSeats} bảo trì` : '',
);
const lockDetailText = computed<string>(() => {
   const lock: SeatMapLock | undefined = seatMapLock.value;
   if (!lock) {
      return '';
   }
   const bookedText: string =
      lock.bookedShowtimeCount > 0
         ? `, trong đó ${lock.bookedShowtimeCount} suất đã có khách đặt vé hoặc đang giữ chỗ`
         : '';
   return `Phòng này còn ${lock.upcomingShowtimeCount} suất chiếu chưa kết thúc, đang mở bán hoặc đang chiếu${bookedText}. Bạn chỉ có thể xem sơ đồ. Hãy chờ các suất kết thúc, hoặc hủy các suất chưa có khách đặt vé ở trang Suất chiếu để chỉnh sửa.`;
});

function adoptLayout(nextSeatLayout: SeatLayout): void {
   savedLayout.value = nextSeatLayout;
   seatMapDraftController.reset(preserveCanvasSize(createDraftFromLayout(nextSeatLayout), seatMapDraft.value));
   queryClient.setQueryData(adminSeatMapKey(nextSeatLayout.hallId), nextSeatLayout);
}

function handleSaved(savedSeatLayout: SeatLayout): void {
   adoptLayout(savedSeatLayout);
   refreshCinema();
}

const {
   mutate: submitSave,
   reset: resetSave,
   isPending: isSaving,
   isSuccess: isSaved,
   isError: isSaveError,
   error: saveError,
} = useMutation<SeatLayout, unknown, void>({
   mutationFn: () =>
      saveSeatMap(props.seatLayout.hallId, {
         version: savedLayout.value.version,
         seats: toSeatCellRequests(seatMapDraft.value),
      }),
   onSuccess: handleSaved,
});

function handleReloaded(reloadedSeatLayout: SeatLayout): void {
   resetSave();
   adoptLayout(reloadedSeatLayout);
}

const {
   mutate: submitReload,
   isPending: isReloading,
   isError: isReloadError,
   error: reloadError,
} = useMutation<SeatLayout, unknown, void>({
   mutationFn: () => getSeatMap(props.seatLayout.hallId),
   onSuccess: handleReloaded,
});

const isConflict = computed<boolean>(
   () => isSaveError.value && getErrorCode(saveError.value) === SEAT_MAP_CONFLICT_CODE,
);
const isSeatMapLocked = computed<boolean>(
   () => isSaveError.value && getErrorCode(saveError.value) === SEAT_MAP_LOCKED_CODE,
);

function handleCellPointerDown(gridCell: GridCell): void {
   seatMapDraftController.beginStroke();
   seatMapDraftController.apply((currentSeatMapDraft) =>
      applyTool(currentSeatMapDraft, seatTypesByCode.value, editorTool.value, gridCell),
   );
}

function handleCellPointerMove(gridCell: GridCell): void {
   seatMapDraftController.apply((currentSeatMapDraft) =>
      applyTool(currentSeatMapDraft, seatTypesByCode.value, editorTool.value, gridCell),
   );
}

function handleRowLabelClick(row: string): void {
   seatMapDraftController.apply((currentSeatMapDraft) =>
      applyToolToRow(currentSeatMapDraft, seatTypesByCode.value, editorTool.value, row),
   );
}

function handleColumnLabelClick(column: number): void {
   seatMapDraftController.apply((currentSeatMapDraft) =>
      applyToolToColumn(currentSeatMapDraft, seatTypesByCode.value, editorTool.value, column),
   );
}

function handleResize(rowCount: number, columns: number): void {
   seatMapDraftController.apply((currentSeatMapDraft) =>
      resizeDraft(currentSeatMapDraft, seatTypesByCode.value, rowCount, columns),
   );
}

function updateRowCount(rowCount: number): void {
   handleResize(rowCount, seatMapDraft.value.columns);
}

function updateColumnCount(columns: number): void {
   handleResize(seatMapDraft.value.rowCount, columns);
}

function handleGenerate(): void {
   if (generateSeatTypeCode.value === '') {
      generateError.value = 'Vui lòng chọn loại ghế mặc định';
      return;
   }
   generateError.value = undefined;
   seatMapDraftController.apply((currentSeatMapDraft) =>
      createGridDraft(
         currentSeatMapDraft,
         seatTypesByCode.value,
         generateRows.value,
         generateColumns.value,
         generateSeatTypeCode.value,
      ),
   );
}

function handleDiscard(): void {
   resetSave();
   seatMapDraftController.reset(preserveCanvasSize(createDraftFromLayout(savedLayout.value), seatMapDraft.value));
}

function handleSave(): void {
   submitSave();
}

function handleReload(): void {
   submitReload();
}

function handleKeyDown(keyboardEvent: KeyboardEvent): void {
   const target: HTMLElement | null = keyboardEvent.target instanceof HTMLElement ? keyboardEvent.target : null;
   const isTyping: boolean = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
   if (isTyping || !(keyboardEvent.metaKey || keyboardEvent.ctrlKey)) {
      return;
   }
   const pressedKey: string = keyboardEvent.key.toLowerCase();
   if (pressedKey === 'z' && keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      seatMapDraftController.redo();
   } else if (pressedKey === 'z') {
      keyboardEvent.preventDefault();
      seatMapDraftController.undo();
   } else if (pressedKey === 'y') {
      keyboardEvent.preventDefault();
      seatMapDraftController.redo();
   }
}

function warnBeforeUnload(beforeUnloadEvent: BeforeUnloadEvent): void {
   beforeUnloadEvent.preventDefault();
}

watch(isDirty, (isDraftDirty: boolean): void => {
   if (isDraftDirty) {
      window.addEventListener('beforeunload', warnBeforeUnload);
   } else {
      window.removeEventListener('beforeunload', warnBeforeUnload);
   }
});

onMounted((): void => {
   window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount((): void => {
   window.removeEventListener('keydown', handleKeyDown);
   window.removeEventListener('beforeunload', warnBeforeUnload);
});
</script>

<template>
   <div class="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside :class="cn('space-y-6', isEditingLocked && 'pointer-events-none opacity-50')" :inert="isEditingLocked">
         <SectionCard title="Công cụ" description="Chọn công cụ rồi bấm hoặc kéo trên sơ đồ để vẽ.">
            <SeatToolPalette v-model="editorTool" :seat-types="seatTypes" />
            <p class="mt-4 text-xs text-ink-500">
               Bấm chữ cái hàng hoặc số cột để áp dụng công cụ cho cả hàng hoặc cột. Ghế đôi chiếm 2 ô liền nhau. Ghế bị
               xóa khỏi sơ đồ vẫn được lưu lịch sử cho vé cũ; ghế còn vé hoặc lượt giữ chỗ của suất chưa chiếu thì không
               xóa được.
            </p>
         </SectionCard>

         <SectionCard title="Kích thước lưới">
            <div class="space-y-3">
               <GridSizeStepper
                  :model-value="seatMapDraft.rowCount"
                  label="Số hàng"
                  :minimum="1"
                  :maximum="MAX_SEAT_ROWS"
                  @update:model-value="updateRowCount"
               />
               <GridSizeStepper
                  :model-value="seatMapDraft.columns"
                  label="Số cột"
                  :minimum="1"
                  :maximum="MAX_SEAT_COLUMNS"
                  @update:model-value="updateColumnCount"
               />
            </div>
         </SectionCard>

         <SectionCard title="Tạo lưới nhanh" description="Thay toàn bộ sơ đồ bằng một lưới đầy ghế.">
            <div class="space-y-4">
               <GridSizeStepper v-model="generateRows" label="Số hàng" :minimum="1" :maximum="MAX_SEAT_ROWS" />
               <GridSizeStepper v-model="generateColumns" label="Số cột" :minimum="1" :maximum="MAX_SEAT_COLUMNS" />
               <BaseSelectField
                  id="generate-seat-type"
                  v-model="generateSeatTypeCode"
                  label="Loại ghế mặc định"
                  :options="seatTypeOptions"
                  :error="generateError"
               />
               <BaseButton variant="secondary" full-width :icon="Grid3x3" @click="handleGenerate">Tạo lưới</BaseButton>
            </div>
         </SectionCard>
      </aside>

      <section class="min-w-0 space-y-4">
         <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-ink-200/80"
         >
            <div class="flex flex-wrap gap-2">
               <BaseButton
                  variant="secondary"
                  class="h-10 px-3"
                  :disabled="!seatMapDraftController.canUndo.value"
                  :icon="Undo2"
                  @click="seatMapDraftController.undo"
               >
                  Hoàn tác
               </BaseButton>
               <BaseButton
                  variant="secondary"
                  class="h-10 px-3"
                  :disabled="!seatMapDraftController.canRedo.value"
                  :icon="Redo2"
                  @click="seatMapDraftController.redo"
               >
                  Làm lại
               </BaseButton>
               <BaseButton
                  variant="ghost"
                  class="h-10 px-3"
                  :disabled="!isDirty"
                  :icon="RotateCcw"
                  @click="handleDiscard"
               >
                  Bỏ thay đổi
               </BaseButton>
            </div>
            <div class="flex items-center gap-3">
               <span
                  v-if="isDirty"
                  class="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-ink-800 ring-1 ring-amber-200"
               >
                  Chưa lưu
               </span>
               <span
                  v-else-if="isSaved"
                  role="status"
                  class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
               >
                  Đã lưu sơ đồ ghế
               </span>
               <span class="text-sm text-ink-600">
                  <strong class="text-ink-900">{{ seatMapStatistics.totalSeats }}</strong> ghế{{ statisticsText }}
               </span>
               <BaseButton
                  :disabled="!isDirty || isEditingLocked"
                  :is-loading="isSaving"
                  :icon="Save"
                  @click="handleSave"
               >
                  Lưu sơ đồ
               </BaseButton>
            </div>
         </div>

         <BaseAlert v-if="isEditingLocked" variant="info">
            <span class="block font-semibold">Sơ đồ ghế đang bị khóa</span>
            <span class="block text-xs font-normal">{{ lockDetailText }}</span>
         </BaseAlert>
         <BaseAlert v-if="isSaveError" variant="error">
            <span>{{ getErrorMessage(saveError) }}</span>
            <span v-if="isSeatMapLocked" class="mt-1 block text-xs font-normal">
               Sơ đồ ghế bị khóa cho tới khi các suất chiếu đã có vé hoặc lượt giữ chỗ kết thúc. Bạn có thể thiết kế sẵn
               trên màn hình này nhưng chưa lưu được.
            </span>
            <BaseButton
               v-if="isConflict"
               variant="secondary"
               class="mt-2 h-8 px-3"
               :is-loading="isReloading"
               @click="handleReload"
            >
               Tải lại bản mới nhất
            </BaseButton>
         </BaseAlert>
         <BaseAlert v-if="isReloadError" variant="error">{{ getErrorMessage(reloadError) }}</BaseAlert>

         <div
            :class="
               cn(
                  'space-y-5 rounded-3xl bg-white p-4 shadow-card ring-1 ring-ink-200/80 sm:p-6',
                  isEditingLocked && 'pointer-events-none',
               )
            "
            :inert="isEditingLocked"
         >
            <SeatGrid
               :rows="rowLetters"
               :columns="seatMapDraft.columns"
               :seats="gridSeats"
               :grid-label="`Sơ đồ ghế phòng ${seatLayout.hallName}`"
               show-empty-cells
               is-editable
               @cell-pointer-down="handleCellPointerDown"
               @cell-pointer-move="handleCellPointerMove"
               @pointer-end="seatMapDraftController.endStroke"
               @row-label-click="handleRowLabelClick"
               @column-label-click="handleColumnLabelClick"
            />
            <SeatLegend :seat-types="seatTypes" show-maintenance show-empty-cell />
         </div>
      </section>
   </div>
</template>
