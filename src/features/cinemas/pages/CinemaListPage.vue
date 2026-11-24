<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { getPublicCinemas, getPublicCities } from '@/api/cinema/cinemaApi';
import PageBanner from '@/components/common/PageBanner.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import { PUBLIC_CITIES_KEY, publicCinemaListKey } from '@/lib/cinema/cinemaQueryKeys';
import { getErrorMessage } from '@/lib/common/apiError';
import { useCityStore } from '@/stores/useCityStore';
import type { Cinema } from '@/types/cinema/cinema';
import type { SelectOption } from '@/types/common/selectOption';
import CinemaCard from '../components/CinemaCard.vue';

const ALL_CITIES_LABEL: string = 'Tất cả tỉnh/thành';

const cityStore = useCityStore();
const selectedCity = computed<string>({
   get: (): string => cityStore.city,
   set: (city: string): void => cityStore.setCity(city),
});

const { data: cities } = useQuery<string[]>({ queryKey: PUBLIC_CITIES_KEY, queryFn: getPublicCities });
const {
   data: cinemas,
   isPending,
   isError,
   error,
} = useQuery<Cinema[]>({
   queryKey: computed(() => publicCinemaListKey(selectedCity.value)),
   queryFn: () => getPublicCinemas(selectedCity.value || undefined),
});

const cityOptions = computed<SelectOption[]>(() => [
   { value: '', label: ALL_CITIES_LABEL },
   ...(cities.value ?? []).map((cityName) => ({ value: cityName, label: cityName })),
]);
const emptyMessage = computed<string>(
   () => `Chưa có cụm rạp nào ${selectedCity.value ? `tại ${selectedCity.value}` : 'trong hệ thống'}.`,
);
</script>

<template>
   <PageBanner
      eyebrow="Rạp chiếu toàn quốc"
      title="Hệ thống rạp chiếu"
      description="Chọn tỉnh/thành phố để xem các cụm rạp, tiện ích đi kèm và sơ đồ ghế từng phòng chiếu."
   />
   <section class="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-12">
      <div class="max-w-sm">
         <BaseSelectField
            id="public-city-filter"
            v-model="selectedCity"
            label="Tỉnh/Thành phố"
            :options="cityOptions"
            :placeholder="ALL_CITIES_LABEL"
         />
      </div>

      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <p v-else-if="isPending" class="text-sm text-ink-500">Đang tải danh sách rạp...</p>
      <p
         v-else-if="cinemas && cinemas.length === 0"
         class="rounded-2xl border border-ink-200 bg-white p-10 text-center text-sm text-ink-500"
      >
         {{ emptyMessage }}
      </p>
      <div v-else-if="cinemas" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         <CinemaCard v-for="cinema in cinemas" :key="cinema.id" :cinema="cinema" />
      </div>
   </section>
</template>
