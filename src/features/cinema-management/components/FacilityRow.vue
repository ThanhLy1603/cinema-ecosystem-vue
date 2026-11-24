<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { deleteFacility, restoreFacility } from '@/api/cinema/cinemaApi';
import RestoreButton from '@/components/common/RestoreButton.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { PUBLIC_CINEMAS_KEY } from '@/lib/cinema/cinemaQueryKeys';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Facility } from '@/types/cinema/cinema';
import { ADMIN_CINEMA_LIST_KEY, ADMIN_FACILITIES_KEY } from '../utils/queryKeys';

interface FacilityRowProps {
   facility: Facility;
   canManage: boolean;
}

const props = defineProps<FacilityRowProps>();

const emit = defineEmits<{ edit: [facilityId: number] }>();

const queryClient: QueryClient = useQueryClient();
const isConfirmingDelete = ref<boolean>(false);

function handleChanged(): void {
   void queryClient.invalidateQueries({ queryKey: ADMIN_FACILITIES_KEY });
   void queryClient.invalidateQueries({ queryKey: ADMIN_CINEMA_LIST_KEY });
   void queryClient.invalidateQueries({ queryKey: PUBLIC_CINEMAS_KEY });
}

const {
   mutate: submitDelete,
   isPending,
   isError,
   error,
} = useMutation<void, unknown, void>({
   mutationFn: () => deleteFacility(props.facility.id),
   onSuccess: handleChanged,
});

function restore(): Promise<unknown> {
   return restoreFacility(props.facility.id);
}

function handleEdit(): void {
   emit('edit', props.facility.id);
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
         <div class="flex min-w-0 items-center gap-3">
            <img
               v-if="facility.iconUrl"
               :src="facility.iconUrl"
               alt=""
               class="size-9 shrink-0 rounded-lg object-contain"
            />
            <span
               v-else
               class="grid size-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-xs font-bold text-ink-500"
            >
               {{ facility.name.charAt(0).toUpperCase() }}
            </span>
            <div class="min-w-0">
               <p class="truncate font-semibold text-ink-900">{{ facility.name }}</p>
               <p v-if="facility.description" class="truncate text-xs text-ink-500">{{ facility.description }}</p>
            </div>
         </div>
         <RestoreButton v-if="canManage && facility.deleted" :restore="restore" @restored="handleChanged" />
         <div v-if="canManage && !facility.deleted && !isConfirmingDelete" class="flex gap-2">
            <BaseButton variant="secondary" class="h-9 px-3" :icon="Pencil" @click="handleEdit">Sửa</BaseButton>
            <BaseButton variant="secondary" class="h-9 px-3" :icon="Trash2" @click="startConfirmingDelete">
               Xóa
            </BaseButton>
         </div>
      </div>
      <div
         v-if="isConfirmingDelete"
         class="flex flex-wrap items-center gap-3 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-800"
      >
         <span class="font-medium">Xóa tiện ích này? Tiện ích sẽ ẩn khỏi các cụm rạp và có thể khôi phục sau.</span>
         <BaseButton class="h-9 px-4" :is-loading="isPending" @click="confirmDelete">Xác nhận xóa</BaseButton>
         <BaseButton variant="ghost" class="h-9 px-4" @click="cancelConfirmingDelete">Hủy</BaseButton>
      </div>
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
   </li>
</template>
