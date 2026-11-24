<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ArrowLeft, KeyRound, Mail } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { forgotPassword } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { validateEmail } from '@/lib/auth/validation';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import type { ForgotPasswordRequest } from '@/types/auth/auth';

const email = ref<string>('');
const emailError = ref<string | undefined>(undefined);

const {
   mutate: submitForgotPassword,
   isPending,
   isSuccess,
   isError,
   error,
   data: successMessage,
} = useMutation<string, unknown, ForgotPasswordRequest>({
   mutationFn: forgotPassword,
});

const serverFieldErrors = computed<Record<string, string>>(() => (isError.value ? getFieldErrors(error.value) : {}));
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);

function handleSubmit(): void {
   const nextEmailError: string | undefined = validateEmail(email.value);
   emailError.value = nextEmailError;
   if (nextEmailError) {
      return;
   }
   submitForgotPassword({ email: email.value.trim() });
}
</script>

<template>
   <div class="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
      <div class="mb-8 space-y-2">
         <div
            class="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-100 text-brand-600"
         >
            <KeyRound class="size-6" aria-hidden="true" />
         </div>
         <h1 class="pt-2 text-3xl font-extrabold tracking-tight text-ink-900">Quên mật khẩu?</h1>
         <p class="text-[15px] text-ink-500">Nhập email đăng ký, chúng tôi sẽ gửi liên kết để bạn đặt mật khẩu mới.</p>
      </div>

      <div v-if="isSuccess" class="space-y-5">
         <BaseAlert variant="success">{{ successMessage }}</BaseAlert>
         <p class="text-sm text-ink-500">
            Liên kết có hiệu lực trong 30 phút. Nếu không thấy email, hãy kiểm tra cả hộp thư rác.
         </p>
      </div>
      <form v-else novalidate class="space-y-5" @submit.prevent="handleSubmit">
         <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
         <BaseTextField
            id="forgot-email"
            v-model="email"
            label="Email"
            type="email"
            :icon="Mail"
            placeholder="ban@example.com"
            autocomplete="email"
            :error="emailError ?? serverFieldErrors.email"
            :disabled="isPending"
            auto-focus
         />
         <BaseButton type="submit" size="lg" full-width :is-loading="isPending">
            {{ isPending ? 'Đang gửi...' : 'Gửi liên kết đặt lại' }}
         </BaseButton>
      </form>

      <p class="mt-8 text-center text-sm text-ink-500">
         <RouterLink
            to="/login"
            class="inline-flex items-center gap-1.5 font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
         >
            <ArrowLeft class="size-4" aria-hidden="true" />
            Quay lại đăng nhập
         </RouterLink>
      </p>
   </div>
</template>
