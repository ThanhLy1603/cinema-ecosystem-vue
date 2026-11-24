<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { MailWarning } from 'lucide-vue-next';
import { resendVerification } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';

const {
   mutate: resend,
   isPending,
   isSuccess,
   isError,
   error,
} = useMutation<void, unknown, void>({
   mutationFn: resendVerification,
});

function handleResend(): void {
   resend();
}
</script>

<template>
   <div class="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div class="flex items-start gap-3">
         <MailWarning class="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden="true" />
         <div class="space-y-1">
            <p class="font-semibold text-ink-900">Email của bạn chưa được xác thực</p>
            <p class="text-sm text-ink-600">
               Xác thực email để bảo vệ tài khoản và liên kết đăng nhập Google. Chúng tôi đã gửi liên kết khi bạn đăng
               ký.
            </p>
         </div>
      </div>
      <BaseAlert v-if="isSuccess" variant="success">Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư.</BaseAlert>
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <BaseButton variant="secondary" :is-loading="isPending" :disabled="isSuccess" @click="handleResend">
         {{ isPending ? 'Đang gửi...' : 'Gửi lại email xác thực' }}
      </BaseButton>
   </div>
</template>
