<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { restoreCinema } from '@/api/cinema/cinemaApi';
import RestoreButton from '@/components/common/RestoreButton.vue';
import type { Cinema } from '@/types/cinema/cinema';
import CinemaStatusBadge from './CinemaStatusBadge.vue';

interface CinemaTableProps {
   cinemas: Cinema[];
   canRestore: boolean;
}

defineProps<CinemaTableProps>();

const emit = defineEmits<{ restored: [] }>();

function restore(cinemaId: number): () => Promise<unknown> {
   return (): Promise<unknown> => restoreCinema(cinemaId);
}

function handleRestored(): void {
   emit('restored');
}

function formatFacilityNames(cinema: Cinema): string {
   return cinema.facilities.length === 0 ? '—' : cinema.facilities.map((facility) => facility.name).join(', ');
}
</script>

<template>
   <p
      v-if="cinemas.length === 0"
      class="rounded-3xl bg-white p-10 text-center text-sm text-ink-500 shadow-card ring-1 ring-ink-200/80"
   >
      Không có cụm rạp nào phù hợp với bộ lọc.
   </p>
   <div v-else class="overflow-x-auto rounded-3xl bg-white shadow-card ring-1 ring-ink-200/80">
      <table class="w-full min-w-[860px] text-left text-sm">
         <thead class="border-b border-ink-100 bg-ink-50/80 text-[11px] uppercase tracking-wider text-ink-500">
            <tr>
               <th class="px-4 py-2.5 font-semibold">Cụm rạp</th>
               <th class="px-4 py-2.5 font-semibold">Tỉnh/Thành phố</th>
               <th class="px-4 py-2.5 font-semibold">Hotline</th>
               <th class="px-4 py-4 text-center font-semibold">Phòng chiếu</th>
               <th class="px-4 py-2.5 font-semibold">Tiện ích</th>
               <th class="px-4 py-2.5 font-semibold">Trạng thái</th>
               <th class="px-4 py-2.5" />
            </tr>
         </thead>
         <tbody class="divide-y divide-ink-100">
            <tr v-for="cinema in cinemas" :key="cinema.id" class="hover:bg-ink-50/60">
               <td class="max-w-[300px] px-4 py-4">
                  <p class="truncate font-semibold text-ink-900">{{ cinema.name }}</p>
                  <p class="truncate text-xs text-ink-500">{{ cinema.address }}</p>
               </td>
               <td class="whitespace-nowrap px-4 py-4 text-ink-700">{{ cinema.city }}</td>
               <td class="whitespace-nowrap px-4 py-4 text-ink-700">{{ cinema.phone ?? '—' }}</td>
               <td class="px-4 py-4 text-center text-ink-700">{{ cinema.hallCount }}</td>
               <td class="max-w-[200px] truncate px-4 py-4 text-ink-700">{{ formatFacilityNames(cinema) }}</td>
               <td class="px-4 py-4">
                  <CinemaStatusBadge :cinema-status="cinema.status" :is-deleted="cinema.deleted" />
               </td>
               <td class="whitespace-nowrap px-4 py-4 text-right">
                  <template v-if="cinema.deleted">
                     <RestoreButton v-if="canRestore" :restore="restore(cinema.id)" @restored="handleRestored" />
                  </template>
                  <RouterLink
                     v-else
                     :to="`/admin/cinemas/${cinema.id}`"
                     class="font-semibold text-brand-700 hover:underline"
                  >
                     Chi tiết
                  </RouterLink>
               </td>
            </tr>
         </tbody>
      </table>
   </div>
</template>
