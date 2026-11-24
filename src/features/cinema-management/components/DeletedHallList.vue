<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { listHalls, restoreHall } from '@/api/cinema/hallApi';
import RestoreButton from '@/components/common/RestoreButton.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Hall } from '@/types/cinema/cinema';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { adminDeletedHallsKey } from '../utils/queryKeys';

interface DeletedHallListProps {
   cinemaId: number;
}

const props = defineProps<DeletedHallListProps>();

const refreshCinema: () => void = useCinemaRefresh(props.cinemaId);

const {
   data: deletedHalls,
   isPending,
   isError,
   error,
} = useQuery<Hall[]>({
   queryKey: adminDeletedHallsKey(props.cinemaId),
   queryFn: () => listHalls(props.cinemaId, true),
});

function restore(hallId: number): () => Promise<unknown> {
   return (): Promise<unknown> => restoreHall(hallId);
}
</script>

<template>
   <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
   <p v-else-if="isPending" class="text-sm text-ink-500">Đang tải phòng đã xóa...</p>
   <p
      v-else-if="deletedHalls && deletedHalls.length === 0"
      class="rounded-2xl bg-ink-50 px-4 py-4 text-center text-sm text-ink-500"
   >
      Không có phòng chiếu nào đã xóa.
   </p>
   <ul v-else class="space-y-3">
      <li
         v-for="hall in deletedHalls"
         :key="hall.id"
         class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-4 py-3"
      >
         <div>
            <p class="font-semibold text-ink-700">
               {{ hall.name }}
               <span class="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">
                  {{ hall.screenType }}
               </span>
            </p>
            <p class="text-xs text-ink-500">{{ hall.totalSeats }} ghế, đã xóa</p>
         </div>
         <RestoreButton :restore="restore(hall.id)" @restored="refreshCinema" />
      </li>
   </ul>
</template>
