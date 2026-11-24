<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { Armchair, Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { deleteHall } from '@/api/cinema/hallApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Hall } from '@/types/cinema/cinema';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import CinemaStatusBadge from './CinemaStatusBadge.vue';

interface HallRowProps {
   hall: Hall;
}

const props = defineProps<HallRowProps>();

const emit = defineEmits<{ edit: [hallId: number] }>();

const refreshCinema: () => void = useCinemaRefresh(props.hall.cinemaId);
const isConfirmingDelete = ref<boolean>(false);

const {
   mutate: submitDelete,
   isPending,
   isError,
   error,
} = useMutation<void, unknown, void>({
   mutationFn: () => deleteHall(props.hall.id),
   onSuccess: refreshCinema,
});

function handleEdit(): void {
   emit('edit', props.hall.id);
}

function startConfirmingDelete(): void {
   isConfirmingDelete.value = true;
}

function cancelConfirmingDelete(): void {
   isConfirmingDelete.value = false;
}

function confirmDelete(): void {
   submitDelete();
}
</script>

<template>
   <li class="space-y-3 rounded-2xl border border-ink-100 px-4 py-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
         <div class="min-w-0">
            <p class="flex flex-wrap items-center gap-2 font-semibold text-ink-900">
               {{ hall.name }}
               <span class="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-700">
                  {{ hall.screenType }}
               </span>
               <CinemaStatusBadge :hall-status="hall.status" />
            </p>
            <p class="mt-0.5 text-xs text-ink-500">{{ hall.totalSeats }} ghế</p>
         </div>
         <div class="flex flex-wrap gap-2">
            <RouterLink
               :to="`/admin/halls/${hall.id}/seat-map`"
               class="inline-flex h-9 items-center gap-2 rounded-xl bg-brand-50 px-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-100"
            >
               <Armchair class="size-4" aria-hidden="true" />
               Sơ đồ ghế
            </RouterLink>
            <BaseButton variant="secondary" class="h-9 px-3" :icon="Pencil" @click="handleEdit">Sửa</BaseButton>
            <BaseButton
               v-if="!isConfirmingDelete"
               variant="secondary"
               class="h-9 px-3"
               :icon="Trash2"
               @click="startConfirmingDelete"
            >
               Xóa
            </BaseButton>
         </div>
      </div>
      <div
         v-if="isConfirmingDelete"
         class="flex flex-wrap items-center gap-3 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-800"
      >
         <span class="font-medium">Xóa phòng chiếu này? Sơ đồ ghế được giữ lại và có thể khôi phục sau.</span>
         <BaseButton class="h-9 px-4" :is-loading="isPending" @click="confirmDelete">Xác nhận xóa</BaseButton>
         <BaseButton variant="ghost" class="h-9 px-4" @click="cancelConfirmingDelete">Hủy</BaseButton>
      </div>
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
   </li>
</template>
