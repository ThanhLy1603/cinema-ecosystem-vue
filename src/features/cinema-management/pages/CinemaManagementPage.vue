<script setup lang="ts">
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { ListChecks, Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { searchAdminCinemas } from '@/api/cinema/cinemaApi';
import PaginationBar from '@/components/common/PaginationBar.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Cinema, CinemaSearchParams, CinemaStatus } from '@/types/cinema/cinema';
import type { PageResponse } from '@/types/common/api';
import CinemaFilterBar, { type CinemaFilters } from '../components/CinemaFilterBar.vue';
import CinemaTable from '../components/CinemaTable.vue';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { ADMIN_CINEMA_LIST_KEY } from '../utils/queryKeys';

const PAGE_SIZE: number = 20;
const EMPTY_FILTERS: CinemaFilters = { search: '', city: '', status: '', deleted: '' };

const authStore = useAuthStore();
const cinemaFilters = ref<CinemaFilters>({ ...EMPTY_FILTERS });
const page = ref<number>(0);
const refreshCinemas: () => void = useCinemaRefresh(null);

const isAdmin = computed<boolean>(() => authStore.hasRole('ROLE_ADMIN'));
const cinemaSearchParams = computed<CinemaSearchParams>(() => ({
   search: cinemaFilters.value.search || undefined,
   city: cinemaFilters.value.city || undefined,
   status: (cinemaFilters.value.status || undefined) as CinemaStatus | undefined,
   deleted: cinemaFilters.value.deleted === 'true',
   page: page.value,
   size: PAGE_SIZE,
}));

const {
   data: cinemaPage,
   isPending,
   isError,
   error,
} = useQuery<PageResponse<Cinema>>({
   queryKey: computed(() => [...ADMIN_CINEMA_LIST_KEY, cinemaSearchParams.value]),
   queryFn: () => searchAdminCinemas(cinemaSearchParams.value),
   placeholderData: keepPreviousData,
});

function handleFiltersChange(nextCinemaFilters: CinemaFilters): void {
   cinemaFilters.value = nextCinemaFilters;
   page.value = 0;
}

function handlePageChange(nextPage: number): void {
   page.value = nextPage;
}
</script>

<template>
   <div class="w-full max-w-7xl space-y-5">
      <header class="flex flex-wrap items-center justify-between gap-4">
         <div>
            <h1 class="text-xl font-semibold tracking-tight text-ink-900">Quản lý cụm rạp</h1>
            <p class="mt-1 text-sm text-ink-500">
               {{ isAdmin ? 'Toàn bộ cụm rạp trong hệ thống.' : 'Các cụm rạp bạn phụ trách.' }}
            </p>
         </div>
         <div class="flex flex-wrap gap-3">
            <BaseLinkButton to="/admin/cinemas/facilities" variant="secondary" :icon="ListChecks">
               Danh mục tiện ích
            </BaseLinkButton>
            <BaseLinkButton v-if="isAdmin" to="/admin/cinemas/new" :icon="Plus">Thêm cụm rạp</BaseLinkButton>
         </div>
      </header>

      <CinemaFilterBar :cinema-filters="cinemaFilters" :is-admin="isAdmin" @change="handleFiltersChange" />

      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <template v-if="cinemaPage">
         <CinemaTable :cinemas="cinemaPage.content" :can-restore="isAdmin" @restored="refreshCinemas" />
         <PaginationBar
            :page="cinemaPage.page"
            :total-pages="cinemaPage.totalPages"
            :total-elements="cinemaPage.totalElements"
            @page-change="handlePageChange"
         />
      </template>
      <p v-if="isPending" class="text-sm text-ink-500">Đang tải danh sách...</p>
   </div>
</template>
