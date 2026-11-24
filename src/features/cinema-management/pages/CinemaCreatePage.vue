<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { createCinema } from '@/api/cinema/cinemaApi';
import SectionCard from '@/components/common/SectionCard.vue';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import type { CinemaDetail, CinemaRequest } from '@/types/cinema/cinema';
import CinemaForm from '../components/CinemaForm.vue';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { useFacilities } from '../hooks/useFacilities';

const router = useRouter();
const refreshCinema: () => void = useCinemaRefresh(null);
const { data: facilities } = useFacilities();

function handleCreated(cinemaDetail: CinemaDetail): void {
   refreshCinema();
   void router.replace(`/admin/cinemas/${cinemaDetail.id}`);
}

const {
   mutate: submitCreate,
   isPending,
   isError,
   error,
} = useMutation<CinemaDetail, unknown, CinemaRequest>({
   mutationFn: createCinema,
   onSuccess: handleCreated,
});

const serverFieldErrors = computed<Record<string, string>>(() => (isError.value ? getFieldErrors(error.value) : {}));
const errorMessage = computed<string | undefined>(() =>
   isError.value && Object.keys(serverFieldErrors.value).length === 0 ? getErrorMessage(error.value) : undefined,
);

function handleSubmit(cinemaRequest: CinemaRequest): void {
   submitCreate(cinemaRequest);
}
</script>

<template>
   <div class="w-full max-w-3xl space-y-6">
      <RouterLink to="/admin/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về danh sách cụm rạp
      </RouterLink>
      <h1 class="text-xl font-semibold tracking-tight text-ink-900">Thêm cụm rạp</h1>
      <SectionCard title="Thông tin cụm rạp" description="Sau khi tạo, bạn có thể thêm phòng chiếu và sơ đồ ghế.">
         <CinemaForm
            :facilities="facilities ?? []"
            can-edit-status
            :is-submitting="isPending"
            submit-label="Tạo cụm rạp"
            :error-message="errorMessage"
            :server-field-errors="serverFieldErrors"
            @submit="handleSubmit"
         />
      </SectionCard>
   </div>
</template>
