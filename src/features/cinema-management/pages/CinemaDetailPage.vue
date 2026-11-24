<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ArrowLeft, ExternalLink } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getAdminCinema, updateCinema } from '@/api/cinema/cinemaApi';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CinemaDetail, CinemaRequest } from '@/types/cinema/cinema';
import CinemaForm from '../components/CinemaForm.vue';
import CinemaStatusBadge from '../components/CinemaStatusBadge.vue';
import DeleteCinemaCard from '../components/DeleteCinemaCard.vue';
import HallSection from '../components/HallSection.vue';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { useFacilities } from '../hooks/useFacilities';
import { adminCinemaDetailKey } from '../utils/queryKeys';

const route = useRoute();
const authStore = useAuthStore();

const cinemaId = computed<number>(() => Number(route.params.cinemaId));
const isValidCinemaId = computed<boolean>(() => Number.isInteger(cinemaId.value) && cinemaId.value > 0);
const isAdmin = computed<boolean>(() => authStore.hasRole('ROLE_ADMIN'));
const refreshCinema: () => void = useCinemaRefresh(isValidCinemaId.value ? cinemaId.value : null);
const { data: facilities } = useFacilities();

const {
   data: cinemaDetail,
   isPending,
   isError,
   error,
} = useQuery<CinemaDetail>({
   queryKey: computed(() => adminCinemaDetailKey(cinemaId.value)),
   queryFn: () => getAdminCinema(cinemaId.value),
   enabled: isValidCinemaId,
});

const {
   mutate: submitUpdate,
   reset: resetUpdate,
   isPending: isUpdating,
   isSuccess: isUpdated,
   isError: isUpdateError,
   error: updateError,
} = useMutation<CinemaDetail, unknown, CinemaRequest>({
   mutationFn: (cinemaRequest) => updateCinema(cinemaId.value, cinemaRequest),
   onSuccess: refreshCinema,
});

const serverFieldErrors = computed<Record<string, string>>(() =>
   isUpdateError.value ? getFieldErrors(updateError.value) : {},
);
const updateErrorMessage = computed<string | undefined>(() =>
   isUpdateError.value && Object.keys(serverFieldErrors.value).length === 0
      ? getErrorMessage(updateError.value)
      : undefined,
);
const formKey = computed<string>(
   () => `${cinemaDetail.value?.id}-${cinemaDetail.value?.name}-${cinemaDetail.value?.status}`,
);

function handleSubmit(cinemaRequest: CinemaRequest): void {
   resetUpdate();
   submitUpdate(cinemaRequest);
}
</script>

<template>
   <div v-if="!isValidCinemaId" class="w-full max-w-3xl space-y-4">
      <BaseAlert variant="error">Mã cụm rạp không hợp lệ.</BaseAlert>
      <RouterLink to="/admin/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về danh sách cụm rạp
      </RouterLink>
   </div>

   <FullPageSpinner v-else-if="isPending" />

   <div v-else-if="isError" class="w-full max-w-3xl space-y-4">
      <BaseAlert variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <RouterLink to="/admin/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về danh sách cụm rạp
      </RouterLink>
   </div>

   <div v-else-if="cinemaDetail" class="w-full max-w-4xl space-y-6">
      <RouterLink to="/admin/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về danh sách cụm rạp
      </RouterLink>
      <header class="flex flex-wrap items-center justify-between gap-3">
         <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-xl font-semibold tracking-tight text-ink-900">{{ cinemaDetail.name }}</h1>
            <CinemaStatusBadge :cinema-status="cinemaDetail.status" />
         </div>
         <RouterLink
            v-if="cinemaDetail.status === 'ACTIVE'"
            :to="`/cinemas/${cinemaDetail.slug}`"
            class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
         >
            Xem trang khách hàng
            <ExternalLink class="size-4" aria-hidden="true" />
         </RouterLink>
      </header>

      <SectionCard title="Thông tin cụm rạp">
         <CinemaForm
            :key="formKey"
            :initial-cinema="cinemaDetail"
            :facilities="facilities ?? []"
            :can-edit-status="isAdmin"
            :is-submitting="isUpdating"
            submit-label="Lưu thay đổi"
            :error-message="updateErrorMessage"
            :success-message="isUpdated ? 'Đã cập nhật thông tin cụm rạp.' : undefined"
            :server-field-errors="serverFieldErrors"
            @submit="handleSubmit"
         />
      </SectionCard>

      <SectionCard title="Phòng chiếu" description="Thêm phòng chiếu rồi thiết kế sơ đồ ghế cho từng phòng.">
         <HallSection :cinema-id="cinemaDetail.id" :halls="cinemaDetail.halls" />
      </SectionCard>

      <SectionCard v-if="isAdmin" title="Xóa cụm rạp">
         <DeleteCinemaCard :cinema-id="cinemaDetail.id" />
      </SectionCard>
   </div>
</template>
