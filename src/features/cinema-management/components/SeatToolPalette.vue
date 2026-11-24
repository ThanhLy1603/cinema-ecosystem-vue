<script setup lang="ts">
import { Eraser } from 'lucide-vue-next';
import SeatSwatch from '@/components/common/SeatSwatch.vue';
import { formatSurcharge } from '@/lib/cinema/seatMap';
import { cn } from '@/lib/common/utils';
import type { SeatType } from '@/types/cinema/cinema';
import type { EditorTool } from '../utils/seatMapEditing';

interface SeatToolPaletteProps {
   seatTypes: SeatType[];
}

defineProps<SeatToolPaletteProps>();

const editorTool = defineModel<EditorTool>({ required: true });

const TOOL_BUTTON_BASE_CLASS: string =
   'flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all';

function getToolButtonClass(isActive: boolean): string {
   return cn(
      TOOL_BUTTON_BASE_CLASS,
      isActive
         ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-100'
         : 'border-ink-200 bg-white hover:border-brand-300',
   );
}

function isSeatToolActive(seatType: SeatType): boolean {
   return editorTool.value.kind === 'seat' && editorTool.value.seatTypeCode === seatType.code;
}

function describeSeatType(seatType: SeatType): string {
   const surchargeText: string = formatSurcharge(seatType.defaultSurcharge);
   return seatType.span > 1 ? `${surchargeText}, chiếm ${seatType.span} ô` : surchargeText;
}

function selectSeatTool(seatType: SeatType): void {
   editorTool.value = { kind: 'seat', seatTypeCode: seatType.code };
}

function selectEraseTool(): void {
   editorTool.value = { kind: 'erase' };
}

function selectMaintenanceTool(): void {
   editorTool.value = { kind: 'maintenance' };
}
</script>

<template>
   <div class="space-y-2" role="group" aria-label="Công cụ vẽ sơ đồ">
      <button
         v-for="seatType in seatTypes"
         :key="seatType.code"
         type="button"
         :aria-pressed="isSeatToolActive(seatType)"
         :class="getToolButtonClass(isSeatToolActive(seatType))"
         @click="selectSeatTool(seatType)"
      >
         <span class="grid w-[4.5rem] shrink-0 place-items-center">
            <SeatSwatch :seat-type-code="seatType.code" :span="seatType.span" />
         </span>
         <span class="min-w-0">
            <span class="block text-sm font-semibold text-ink-900">{{ seatType.name }}</span>
            <span class="block truncate text-xs text-ink-500">{{ describeSeatType(seatType) }}</span>
         </span>
      </button>
      <button
         type="button"
         :aria-pressed="editorTool.kind === 'erase'"
         :class="getToolButtonClass(editorTool.kind === 'erase')"
         @click="selectEraseTool"
      >
         <span class="grid w-[4.5rem] shrink-0 place-items-center">
            <Eraser class="size-5 text-ink-600" aria-hidden="true" />
         </span>
         <span class="min-w-0">
            <span class="block text-sm font-semibold text-ink-900">Xóa ghế hoặc tạo lối đi</span>
            <span class="block truncate text-xs text-ink-500">Bấm hoặc kéo qua ghế để bỏ khỏi sơ đồ</span>
         </span>
      </button>
      <button
         type="button"
         :aria-pressed="editorTool.kind === 'maintenance'"
         :class="getToolButtonClass(editorTool.kind === 'maintenance')"
         @click="selectMaintenanceTool"
      >
         <span class="grid w-[4.5rem] shrink-0 place-items-center">
            <SeatSwatch variant="maintenance" />
         </span>
         <span class="min-w-0">
            <span class="block text-sm font-semibold text-ink-900">Đánh dấu bảo trì</span>
            <span class="block truncate text-xs text-ink-500">Bấm vào ghế để bật hoặc tắt bảo trì</span>
         </span>
      </button>
   </div>
</template>
