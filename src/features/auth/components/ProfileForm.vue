<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { Calendar, Image, Mail, Phone, Save, User as UserIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { updateMyProfile } from '@/api/auth/userApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { validateAvatarUrl, validateDateOfBirth, validateFullName, validatePhone } from '@/lib/auth/validation';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { SelectOption } from '@/types/common/selectOption';
import type { Gender, UpdateProfileRequest, UserProfile } from '@/types/auth/profile';
import { PROFILE_QUERY_KEY } from '../utils/queryKeys';

interface ProfileFormProps {
   userProfile: UserProfile;
}

interface ProfileFieldErrors {
   fullName?: string;
   phone?: string;
   dateOfBirth?: string;
   avatarUrl?: string;
}

const props = defineProps<ProfileFormProps>();

const GENDER_OPTIONS: SelectOption[] = [
   { value: '', label: 'Không muốn nêu' },
   { value: 'MALE', label: 'Nam' },
   { value: 'FEMALE', label: 'Nữ' },
   { value: 'OTHER', label: 'Khác' },
];

const queryClient: QueryClient = useQueryClient();
const authStore = useAuthStore();

const fullName = ref<string>(props.userProfile.fullName);
const phone = ref<string>(props.userProfile.phone ?? '');
const dateOfBirth = ref<string>(props.userProfile.dateOfBirth ?? '');
const gender = ref<string>(props.userProfile.gender ?? '');
const avatarUrl = ref<string>(props.userProfile.avatarUrl ?? '');
const fieldErrors = ref<ProfileFieldErrors>({});

const maxDateOfBirth: string = new Date().toISOString().slice(0, 10);

function emptyToNull(value: string): string | null {
   const trimmedValue: string = value.trim();
   return trimmedValue.length === 0 ? null : trimmedValue;
}

function handleUpdateSuccess(updatedUserProfile: UserProfile): void {
   queryClient.setQueryData<UserProfile>(PROFILE_QUERY_KEY, updatedUserProfile);
   authStore.setUser(updatedUserProfile);
}

const {
   mutate: submitUpdate,
   reset: resetMutation,
   isPending,
   isSuccess,
   isError,
   error,
} = useMutation<UserProfile, unknown, UpdateProfileRequest>({
   mutationFn: updateMyProfile,
   onSuccess: handleUpdateSuccess,
});

const serverFieldErrors = computed<Record<string, string>>(() => {
   if (!isError.value) {
      return {};
   }
   const fieldErrorsFromServer: Record<string, string> = { ...getFieldErrors(error.value) };
   if (getErrorCode(error.value) === 'PHONE_ALREADY_EXISTS') {
      fieldErrorsFromServer.phone = getErrorMessage(error.value);
   }
   return fieldErrorsFromServer;
});
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);

function handleSubmit(): void {
   resetMutation();
   const nextFieldErrors: ProfileFieldErrors = {
      fullName: validateFullName(fullName.value),
      phone: validatePhone(phone.value),
      dateOfBirth: validateDateOfBirth(dateOfBirth.value),
      avatarUrl: validateAvatarUrl(avatarUrl.value),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((fieldError) => fieldError !== undefined)) {
      return;
   }
   submitUpdate({
      fullName: fullName.value.trim(),
      phone: emptyToNull(phone.value),
      dateOfBirth: emptyToNull(dateOfBirth.value),
      gender: gender.value === '' ? null : (gender.value as Gender),
      avatarUrl: emptyToNull(avatarUrl.value),
   });
}
</script>

<template>
   <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
      <BaseAlert v-if="isSuccess" variant="success">Đã cập nhật thông tin cá nhân.</BaseAlert>
      <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>

      <BaseTextField
         id="profile-email"
         :model-value="userProfile.email"
         label="Email"
         type="email"
         :icon="Mail"
         hint="Email dùng để đăng nhập và không thể thay đổi."
         disabled
      />
      <BaseTextField
         id="profile-fullName"
         v-model="fullName"
         label="Họ và tên"
         :icon="UserIcon"
         autocomplete="name"
         :max-length="150"
         :error="fieldErrors.fullName ?? serverFieldErrors.fullName"
         :disabled="isPending"
      />
      <BaseTextField
         id="profile-phone"
         v-model="phone"
         label="Số điện thoại"
         type="tel"
         :icon="Phone"
         autocomplete="tel"
         optional
         :error="fieldErrors.phone ?? serverFieldErrors.phone"
         :disabled="isPending"
      />
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
         <BaseTextField
            id="profile-dateOfBirth"
            v-model="dateOfBirth"
            label="Ngày sinh"
            type="date"
            :icon="Calendar"
            :max="maxDateOfBirth"
            optional
            :error="fieldErrors.dateOfBirth ?? serverFieldErrors.dateOfBirth"
            :disabled="isPending"
         />
         <BaseSelectField
            id="profile-gender"
            v-model="gender"
            label="Giới tính"
            :options="GENDER_OPTIONS"
            optional
            :error="serverFieldErrors.gender"
            :disabled="isPending"
         />
      </div>
      <BaseTextField
         id="profile-avatarUrl"
         v-model="avatarUrl"
         label="Ảnh đại diện"
         :icon="Image"
         placeholder="https://..."
         hint="Dán đường dẫn ảnh bắt đầu bằng https://."
         optional
         :error="fieldErrors.avatarUrl ?? serverFieldErrors.avatarUrl"
         :disabled="isPending"
      />

      <BaseButton type="submit" size="lg" :icon="Save" :is-loading="isPending">
         {{ isPending ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </BaseButton>
   </form>
</template>
