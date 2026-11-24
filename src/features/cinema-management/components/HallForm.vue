<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { Save } from 'lucide-vue-next';
import { ref } from 'vue';
import { createHall, updateHall } from '@/api/cinema/hallApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Hall, HallRequest, HallStatus, ScreenType } from '@/types/cinema/cinema';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { HALL_STATUS_OPTIONS, SCREEN_TYPE_OPTIONS } from '../utils/labels';
import { validateRequiredSelection, validateRequiredText } from '../utils/validation';

interface HallFormProps {
   cinemaId: number;
   hall?: Hall;
}

interface HallFieldErrors {
   name?: string;
   screenType?: string;
   status?: string;
}

const props = withDefaults(defineProps<HallFormProps>(), { hall: undefined });

const emit = defineEmits<{ done: []; cancel: [] }>();

const refreshCinema: () => void = useCinemaRefresh(props.cinemaId);
const name = ref<string>(props.hall?.name ?? '');
const screenType = ref<string>(props.hall?.screenType ?? '2D');
const status = ref<string>(props.hall?.status ?? 'ACTIVE');
const fieldErrors = ref<HallFieldErrors>({});
const fieldIdSuffix: string = String(props.hall?.id ?? 'new');

function handleSaved(): void {
   refreshCinema();
   emit('done');
}

const {
   mutate: submitHall,
   reset: resetMutation,
   isPending,
   isError,
   error,
} = useMutation<Hall, unknown, HallRequest>({
   mutationFn: (hallRequest) =>
      props.hall ? updateHall(props.hall.id, hallRequest) : createHall(props.cinemaId, hallRequest),
   onSuccess: handleSaved,
});

function handleSubmit(): void {
   resetMutation();
   const nextFieldErrors: HallFieldErrors = {
      name: validateRequiredText(name.value, 'Vui lòng nhập tên phòng chiếu', 100),
      screenType: validateRequiredSelection(screenType.value, 'Vui lòng chọn loại màn hình'),
      status: validateRequiredSelection(status.value, 'Vui lòng chọn trạng thái'),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((message) => message !== undefined)) {
      return;
   }
   submitHall({
      name: name.value.trim(),
      screenType: screenType.value as ScreenType,
      status: status.value as HallStatus,
   });
}

function handleCancel(): void {
   emit('cancel');
}
</script>

<template>
   <form
      class="space-y-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5"
      novalidate
      @submit.prevent="handleSubmit"
   >
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
         <BaseTextField
            :id="`hall-name-${fieldIdSuffix}`"
            v-model="name"
            label="Tên phòng chiếu"
            :max-length="100"
            auto-focus
            :error="fieldErrors.name"
         />
         <BaseSelectField
            :id="`hall-screen-type-${fieldIdSuffix}`"
            v-model="screenType"
            label="Loại màn hình"
            :options="SCREEN_TYPE_OPTIONS"
            :error="fieldErrors.screenType"
         />
         <BaseSelectField
            :id="`hall-status-${fieldIdSuffix}`"
            v-model="status"
            label="Trạng thái"
            :options="HALL_STATUS_OPTIONS"
            :error="fieldErrors.status"
         />
      </div>
      <div class="flex flex-wrap gap-3">
         <BaseButton type="submit" :is-loading="isPending" :icon="Save">
            {{ hall ? 'Lưu phòng chiếu' : 'Thêm phòng chiếu' }}
         </BaseButton>
         <BaseButton variant="ghost" @click="handleCancel">Hủy</BaseButton>
      </div>
   </form>
</template>
