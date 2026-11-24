<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { MapPin } from 'lucide-vue-next';
import { computed } from 'vue';
import { getPublicCities } from '@/api/cinema/cinemaApi';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import { PUBLIC_CITIES_KEY } from '@/lib/cinema/cinemaQueryKeys';
import { useCityStore } from '@/stores/useCityStore';
import type { SelectOption } from '@/types/common/selectOption';

const ALL_CITIES_LABEL: string = 'Toàn quốc';

const cityStore = useCityStore();
const { data: cities } = useQuery<string[]>({ queryKey: PUBLIC_CITIES_KEY, queryFn: getPublicCities });

const selectedCity = computed<string>({
   get: (): string => cityStore.city,
   set: (city: string): void => cityStore.setCity(city),
});

const cityOptions = computed<SelectOption[]>(() => [
   { value: '', label: ALL_CITIES_LABEL },
   ...(cities.value ?? []).map((cityName) => ({ value: cityName, label: cityName })),
]);
</script>

<template>
   <div class="relative w-56 xl:w-44 2xl:w-56">
      <MapPin
         class="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-ink-700"
         aria-hidden="true"
      />
      <BaseSelectField
         id="header-city"
         v-model="selectedCity"
         label="Chọn tỉnh/thành phố"
         hide-label
         :options="cityOptions"
         :placeholder="ALL_CITIES_LABEL"
         trigger-class-name="h-10 rounded-xl border-transparent bg-ink-100/80 pl-9 text-[13px] font-semibold shadow-none text-ink-800"
         menu-class-name="right-0 w-60"
      />
   </div>
</template>
