<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { Save } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { createFacility, updateFacility } from '@/api/cinema/cinemaApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { PUBLIC_CINEMAS_KEY } from '@/lib/cinema/cinemaQueryKeys';
import { getErrorCode, getErrorMessage } from '@/lib/common/apiError';
import type { Facility, FacilityRequest } from '@/types/cinema/cinema';
import { ADMIN_CINEMA_LIST_KEY, ADMIN_FACILITIES_KEY } from '../utils/queryKeys';
import { emptyToNull, validateOptionalHttpsUrl, validateOptionalText, validateRequiredText } from '../utils/validation';

interface FacilityFormProps {
   facility?: Facility;
}

interface FacilityFieldErrors {
   name?: string;
   iconUrl?: string;
   description?: string;
}

const props = withDefaults(defineProps<FacilityFormProps>(), { facility: undefined });

const emit = defineEmits<{ done: []; cancel: [] }>();

const queryClient: QueryClient = useQueryClient();
const name = ref<string>(props.facility?.name ?? '');
const iconUrl = ref<string>(props.facility?.iconUrl ?? '');
const description = ref<string>(props.facility?.description ?? '');
const fieldErrors = ref<FacilityFieldErrors>({});
const fieldIdSuffix: string = String(props.facility?.id ?? 'new');

function handleSaved(): void {
   void queryClient.invalidateQueries({ queryKey: ADMIN_FACILITIES_KEY });
   void queryClient.invalidateQueries({ queryKey: ADMIN_CINEMA_LIST_KEY });
   void queryClient.invalidateQueries({ queryKey: PUBLIC_CINEMAS_KEY });
   emit('done');
}

const {
   mutate: submitFacility,
   reset: resetMutation,
   isPending,
   isError,
   error,
} = useMutation<Facility, unknown, FacilityRequest>({
   mutationFn: (facilityRequest) =>
      props.facility ? updateFacility(props.facility.id, facilityRequest) : createFacility(facilityRequest),
   onSuccess: handleSaved,
});

const isNameTaken = computed<boolean>(() => isError.value && getErrorCode(error.value) === 'FACILITY_NAME_EXISTS');

function handleSubmit(): void {
   resetMutation();
   const nextFieldErrors: FacilityFieldErrors = {
      name: validateRequiredText(name.value, 'Vui lòng nhập tên tiện ích', 100),
      iconUrl: validateOptionalHttpsUrl(iconUrl.value, 500),
      description: validateOptionalText(description.value, 500),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((message) => message !== undefined)) {
      return;
   }
   submitFacility({
      name: name.value.trim(),
      iconUrl: emptyToNull(iconUrl.value),
      description: emptyToNull(description.value),
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
      <BaseAlert v-if="isError && !isNameTaken" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
         <BaseTextField
            :id="`facility-name-${fieldIdSuffix}`"
            v-model="name"
            label="Tên tiện ích"
            :max-length="100"
            auto-focus
            :error="fieldErrors.name ?? (isNameTaken ? getErrorMessage(error) : undefined)"
         />
         <BaseTextField
            :id="`facility-icon-${fieldIdSuffix}`"
            v-model="iconUrl"
            label="Biểu tượng"
            placeholder="https://..."
            optional
            :error="fieldErrors.iconUrl"
         />
         <div class="sm:col-span-2">
            <BaseTextField
               :id="`facility-description-${fieldIdSuffix}`"
               v-model="description"
               label="Mô tả"
               optional
               :max-length="500"
               :error="fieldErrors.description"
            />
         </div>
      </div>
      <div class="flex flex-wrap gap-3">
         <BaseButton type="submit" :is-loading="isPending" :icon="Save">
            {{ facility ? 'Lưu tiện ích' : 'Thêm tiện ích' }}
         </BaseButton>
         <BaseButton variant="ghost" @click="handleCancel">Hủy</BaseButton>
      </div>
   </form>
</template>
