<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { CINEMA_STATUS_FILTER_OPTIONS, DELETED_FILTER_OPTIONS } from '../utils/labels';
import { buildCityFilterOptions } from '../utils/provinces';

export interface CinemaFilters {
   search: string;
   city: string;
   status: string;
   deleted: string;
}

interface CinemaFilterBarProps {
   cinemaFilters: CinemaFilters;
   isAdmin: boolean;
}

const props = defineProps<CinemaFilterBarProps>();

const emit = defineEmits<{ change: [cinemaFilters: CinemaFilters] }>();

const CITY_FILTER_OPTIONS = buildCityFilterOptions();

const searchText = ref<string>(props.cinemaFilters.search);

function handleSubmit(): void {
   emit('change', { ...props.cinemaFilters, search: searchText.value.trim() });
}

function updateFilter(filterName: 'city' | 'status' | 'deleted', filterValue: string): void {
   emit('change', { ...props.cinemaFilters, [filterName]: filterValue });
}
</script>

<template>
   <form
      class="flex flex-wrap items-end gap-3 rounded-lg bg-white p-4 shadow-card ring-1 ring-ink-200/80"
      @submit.prevent="handleSubmit"
   >
      <div class="min-w-[240px] flex-1">
         <BaseTextField
            id="cinema-search"
            v-model="searchText"
            label="Tìm kiếm"
            :icon="Search"
            placeholder="Tên rạp hoặc địa chỉ"
         />
      </div>
      <div class="w-44">
         <BaseSelectField
            id="cinema-city-filter"
            :model-value="cinemaFilters.city"
            label="Tỉnh/Thành phố"
            :options="CITY_FILTER_OPTIONS"
            @update:model-value="updateFilter('city', $event)"
         />
      </div>
      <div class="w-44">
         <BaseSelectField
            id="cinema-status-filter"
            :model-value="cinemaFilters.status"
            label="Trạng thái"
            :options="CINEMA_STATUS_FILTER_OPTIONS"
            @update:model-value="updateFilter('status', $event)"
         />
      </div>
      <div v-if="isAdmin" class="w-44">
         <BaseSelectField
            id="cinema-deleted-filter"
            :model-value="cinemaFilters.deleted"
            label="Hiển thị"
            :options="DELETED_FILTER_OPTIONS"
            placeholder="Đang sử dụng"
            @update:model-value="updateFilter('deleted', $event)"
         />
      </div>
      <BaseButton type="submit" :icon="Search">Tìm</BaseButton>
   </form>
</template>
