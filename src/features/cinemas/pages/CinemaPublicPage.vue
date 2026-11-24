<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { ArrowLeft, MapPin, Navigation, Phone } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getPublicCinema } from '@/api/cinema/cinemaApi';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { publicCinemaDetailKey } from '@/lib/cinema/cinemaQueryKeys';
import { getErrorMessage } from '@/lib/common/apiError';
import { cn } from '@/lib/common/utils';
import type { CinemaDetail, Hall } from '@/types/cinema/cinema';
import FacilityChips from '../components/FacilityChips.vue';
import HallSeatPreview from '../components/HallSeatPreview.vue';
import { buildMapUrl, formatCoordinates } from '../utils/mapLink';

const route = useRoute();
const slug = computed<string>(() => String(route.params.slug ?? ''));
const selectedHallId = ref<number | null>(null);

const {
   data: cinemaDetail,
   isPending,
   isError,
   error,
} = useQuery<CinemaDetail>({
   queryKey: computed(() => publicCinemaDetailKey(slug.value)),
   queryFn: () => getPublicCinema(slug.value),
   enabled: computed(() => slug.value.length > 0),
});

const activeHall = computed<Hall | undefined>(
   () => cinemaDetail.value?.halls.find((hall) => hall.id === selectedHallId.value) ?? cinemaDetail.value?.halls[0],
);

function selectHall(hallId: number): void {
   selectedHallId.value = hallId;
}

function getTabClass(hall: Hall): string {
   return cn(
      'rounded-xl border px-4 py-2 text-sm font-bold transition-all',
      hall.id === activeHall.value?.id
         ? 'border-brand-500 bg-brand-500 text-white shadow-glow'
         : 'border-ink-200 bg-ink-100 text-ink-700 hover:text-brand-600',
   );
}

function getTabBadgeClass(hall: Hall): string {
   return cn(
      'ml-2 rounded-full px-2 py-0.5 text-xs font-bold',
      hall.id === activeHall.value?.id ? 'bg-white/25 text-white' : 'bg-white text-ink-700',
   );
}
</script>

<template>
   <FullPageSpinner v-if="isPending" />

   <section v-else-if="isError" class="mx-auto w-full max-w-3xl space-y-4 px-4 py-12">
      <BaseAlert variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <RouterLink to="/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Tất cả rạp chiếu
      </RouterLink>
   </section>

   <section v-else-if="cinemaDetail" class="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6">
      <RouterLink to="/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Tất cả rạp chiếu
      </RouterLink>

      <header class="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-xs sm:p-8">
         <span class="text-xs font-bold uppercase tracking-wider text-brand-600">{{ cinemaDetail.city }}</span>
         <h1 class="text-3xl font-extrabold tracking-tight text-ink-900">{{ cinemaDetail.name }}</h1>
         <ul class="space-y-2 text-sm text-ink-600">
            <li class="flex items-start gap-2">
               <MapPin class="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden="true" />
               {{ cinemaDetail.address }}
            </li>
            <li v-if="cinemaDetail.phone" class="flex items-center gap-2">
               <Phone class="size-4 shrink-0 text-ink-400" aria-hidden="true" />
               <a :href="`tel:${cinemaDetail.phone}`" class="font-medium hover:text-brand-700">
                  {{ cinemaDetail.phone }}
               </a>
            </li>
            <li
               v-if="cinemaDetail.latitude !== null && cinemaDetail.longitude !== null"
               class="flex flex-wrap items-center gap-2"
            >
               <Navigation class="size-4 shrink-0 text-ink-400" aria-hidden="true" />
               <a
                  :href="buildMapUrl(cinemaDetail.latitude, cinemaDetail.longitude)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium hover:text-brand-700"
               >
                  Xem trên bản đồ
               </a>
               <span class="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                  {{ formatCoordinates(cinemaDetail.latitude, cinemaDetail.longitude) }}
               </span>
            </li>
         </ul>
         <FacilityChips :facilities="cinemaDetail.facilities" />
      </header>

      <section class="space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-xs sm:p-8">
         <h2 class="text-xl font-bold text-ink-900">Phòng chiếu và sơ đồ ghế</h2>
         <p v-if="cinemaDetail.halls.length === 0" class="text-sm text-ink-500">Cụm rạp này chưa mở phòng chiếu nào.</p>
         <template v-if="activeHall">
            <div role="tablist" aria-label="Chọn phòng chiếu" class="flex flex-wrap gap-2">
               <button
                  v-for="hall in cinemaDetail.halls"
                  :key="hall.id"
                  type="button"
                  role="tab"
                  :aria-selected="hall.id === activeHall.id"
                  :class="getTabClass(hall)"
                  @click="selectHall(hall.id)"
               >
                  {{ hall.name }}
                  <span :class="getTabBadgeClass(hall)">{{ hall.screenType }}</span>
               </button>
            </div>
            <HallSeatPreview :key="activeHall.id" :hall-id="activeHall.id" />
         </template>
      </section>
   </section>
</template>
