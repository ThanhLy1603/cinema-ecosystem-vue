<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { KeyRound, ShieldCheck } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import { resetPassword } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { validateConfirmPassword, validateNewPassword } from '@/lib/auth/validation';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import type { ResetPasswordRequest } from '@/types/auth/auth';
import PasswordStrength from '../components/PasswordStrength.vue';
import { PASSWORD_RESET_NOTICE } from '../utils/loginNotice';

interface ResetFieldErrors {
   newPassword?: string;
   confirmPassword?: string;
}

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();

const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const fieldErrors = ref<ResetFieldErrors>({});

const token = computed<string>(() => (typeof route.query.token === 'string' ? route.query.token : ''));

function handleResetSuccess(): void {
   void router.replace({ name: 'login', query: { notice: PASSWORD_RESET_NOTICE } });
}

const {
   mutate: submitResetPassword,
   isPending,
   isError,
   error,
} = useMutation<void, unknown, ResetPasswordRequest>({
   mutationFn: resetPassword,
   onSuccess: handleResetSuccess,
});

const errorCode = computed<string | null>(() => (isError.value ? getErrorCode(error.value) : null));
const isTokenRejected = computed<boolean>(() => errorCode.value === 'INVALID_OR_EXPIRED_TOKEN');
const serverFieldErrors = computed<Record<string, string>>(() => {
   if (!isError.value) {
      return {};
   }
   const fieldErrorsFromServer: Record<string, string> = { ...getFieldErrors(error.value) };
   if (errorCode.value === 'PASSWORD_TOO_LONG') {
      fieldErrorsFromServer.newPassword = getErrorMessage(error.value);
   }
   return fieldErrorsFromServer;
});
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);

function handleSubmit(): void {
   const nextFieldErrors: ResetFieldErrors = {
      newPassword: validateNewPassword(newPassword.value),
      confirmPassword: validateConfirmPassword(newPassword.value, confirmPassword.value),
   };
   fieldErrors.value = nextFieldErrors;
   if (nextFieldErrors.newPassword || nextFieldErrors.confirmPassword) {
      return;
   }
   submitResetPassword({ token: token.value, newPassword: newPassword.value });
}
</script>

<template>
   <div
      v-if="token === '' || isTokenRejected"
      class="space-y-6 rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10"
   >
      <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Liên kết không hợp lệ</h1>
      <BaseAlert variant="error">
         {{
            isTokenRejected
               ? getErrorMessage(error)
               : 'Liên kết đặt lại mật khẩu thiếu mã xác thực. Vui lòng mở lại liên kết trong email.'
         }}
      </BaseAlert>
      <BaseLinkButton to="/forgot-password" size="lg" full-width>Yêu cầu liên kết mới</BaseLinkButton>
   </div>

   <div v-else class="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
      <div class="mb-8 space-y-2">
         <div
            class="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-100 text-brand-600"
         >
            <KeyRound class="size-6" aria-hidden="true" />
         </div>
         <h1 class="pt-2 text-3xl font-extrabold tracking-tight text-ink-900">Đặt mật khẩu mới</h1>
         <p class="text-[15px] text-ink-500">
            Mật khẩu mới áp dụng cho mọi thiết bị, các phiên đăng nhập cũ sẽ bị đăng xuất.
         </p>
      </div>

      <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
         <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
         <div class="space-y-3">
            <BaseTextField
               id="reset-new-password"
               v-model="newPassword"
               label="Mật khẩu mới"
               type="password"
               :icon="KeyRound"
               autocomplete="new-password"
               hint="Tối thiểu 8 ký tự, gồm cả chữ và số."
               :error="fieldErrors.newPassword ?? serverFieldErrors.newPassword"
               :disabled="isPending"
               auto-focus
            />
            <PasswordStrength :password="newPassword" />
         </div>
         <BaseTextField
            id="reset-confirm-password"
            v-model="confirmPassword"
            label="Nhập lại mật khẩu mới"
            type="password"
            :icon="ShieldCheck"
            autocomplete="new-password"
            :error="fieldErrors.confirmPassword"
            :disabled="isPending"
         />
         <BaseButton type="submit" size="lg" full-width :is-loading="isPending">
            {{ isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu' }}
         </BaseButton>
      </form>

      <p class="mt-8 text-center text-sm text-ink-500">
         <RouterLink
            to="/login"
            class="font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
         >
            Quay lại đăng nhập
         </RouterLink>
      </p>
   </div>
</template>
