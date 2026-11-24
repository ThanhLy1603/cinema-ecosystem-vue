<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { KeyRound, Lock, ShieldCheck } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { changeMyPassword } from '@/api/auth/userApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { validateConfirmPassword, validateLoginPassword, validateNewPassword } from '@/lib/auth/validation';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginResponse } from '@/types/auth/auth';
import type { ChangePasswordRequest } from '@/types/auth/profile';
import { PROFILE_QUERY_KEY } from '../utils/queryKeys';
import PasswordStrength from './PasswordStrength.vue';

interface ChangePasswordFormProps {
   hasPassword: boolean;
}

interface PasswordFieldErrors {
   currentPassword?: string;
   newPassword?: string;
   confirmPassword?: string;
}

const props = defineProps<ChangePasswordFormProps>();

const queryClient: QueryClient = useQueryClient();
const authStore = useAuthStore();

const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const fieldErrors = ref<PasswordFieldErrors>({});

function handleChangeSuccess(loginResponse: LoginResponse): void {
   authStore.setAuth(loginResponse.user);
   currentPassword.value = '';
   newPassword.value = '';
   confirmPassword.value = '';
   fieldErrors.value = {};
   void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
}

const {
   mutate: submitChange,
   reset: resetMutation,
   isPending,
   isSuccess,
   isError,
   error,
} = useMutation<LoginResponse, unknown, ChangePasswordRequest>({
   mutationFn: changeMyPassword,
   onSuccess: handleChangeSuccess,
});

const serverFieldErrors = computed<Record<string, string>>(() => {
   if (!isError.value) {
      return {};
   }
   const fieldErrorsFromServer: Record<string, string> = { ...getFieldErrors(error.value) };
   const errorCode: string | null = getErrorCode(error.value);
   if (errorCode === 'INVALID_CURRENT_PASSWORD' || errorCode === 'CURRENT_PASSWORD_REQUIRED') {
      fieldErrorsFromServer.currentPassword = getErrorMessage(error.value);
   }
   if (errorCode === 'NEW_PASSWORD_SAME_AS_CURRENT' || errorCode === 'PASSWORD_TOO_LONG') {
      fieldErrorsFromServer.newPassword = getErrorMessage(error.value);
   }
   return fieldErrorsFromServer;
});
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);
const submitLabel = computed<string>(() => (props.hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu'));

function handleSubmit(): void {
   resetMutation();
   const nextFieldErrors: PasswordFieldErrors = {
      currentPassword: props.hasPassword ? validateLoginPassword(currentPassword.value) : undefined,
      newPassword: validateNewPassword(newPassword.value),
      confirmPassword: validateConfirmPassword(newPassword.value, confirmPassword.value),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((fieldError) => fieldError !== undefined)) {
      return;
   }
   submitChange({
      currentPassword: props.hasPassword ? currentPassword.value : undefined,
      newPassword: newPassword.value,
   });
}
</script>

<template>
   <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
      <BaseAlert v-if="!hasPassword" variant="info">
         Tài khoản của bạn đang đăng nhập bằng Google và chưa có mật khẩu. Tạo mật khẩu để có thể đăng nhập bằng email.
      </BaseAlert>
      <BaseAlert v-if="isSuccess" variant="success">
         {{
            hasPassword
               ? 'Đã đổi mật khẩu. Các thiết bị khác đã bị đăng xuất.'
               : 'Đã tạo mật khẩu. Các thiết bị khác đã bị đăng xuất.'
         }}
      </BaseAlert>
      <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>

      <BaseTextField
         v-if="hasPassword"
         id="current-password"
         v-model="currentPassword"
         label="Mật khẩu hiện tại"
         type="password"
         :icon="Lock"
         autocomplete="current-password"
         :error="fieldErrors.currentPassword ?? serverFieldErrors.currentPassword"
         :disabled="isPending"
      />
      <div class="space-y-3">
         <BaseTextField
            id="new-password"
            v-model="newPassword"
            label="Mật khẩu mới"
            type="password"
            :icon="KeyRound"
            autocomplete="new-password"
            hint="Tối thiểu 8 ký tự, gồm cả chữ và số."
            :error="fieldErrors.newPassword ?? serverFieldErrors.newPassword"
            :disabled="isPending"
         />
         <PasswordStrength :password="newPassword" />
      </div>
      <BaseTextField
         id="confirm-new-password"
         v-model="confirmPassword"
         label="Nhập lại mật khẩu mới"
         type="password"
         :icon="ShieldCheck"
         autocomplete="new-password"
         :error="fieldErrors.confirmPassword"
         :disabled="isPending"
      />

      <BaseButton type="submit" size="lg" :is-loading="isPending">
         {{ isPending ? 'Đang xử lý...' : submitLabel }}
      </BaseButton>
   </form>
</template>
