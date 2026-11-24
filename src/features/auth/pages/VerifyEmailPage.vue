<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import { verifyEmail } from '@/api/auth/authApi';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { VerifyEmailRequest } from '@/types/auth/auth';
import { PROFILE_QUERY_KEY } from '../utils/queryKeys';

const MISSING_TOKEN_MESSAGE: string = 'Liên kết xác thực thiếu mã xác thực. Vui lòng mở lại liên kết trong email.';

const route: RouteLocationNormalizedLoaded = useRoute();
const queryClient: QueryClient = useQueryClient();
const authStore = useAuthStore();

const token = computed<string>(() => (typeof route.query.token === 'string' ? route.query.token : ''));

function handleVerifySuccess(): void {
   if (authStore.user) {
      authStore.setUser({ ...authStore.user, emailVerified: true });
   }
   void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
}

const {
   mutate: submitVerifyEmail,
   isSuccess,
   isError,
   error,
} = useMutation<void, unknown, VerifyEmailRequest>({
   mutationFn: verifyEmail,
   onSuccess: handleVerifySuccess,
});

const isVerifying = computed<boolean>(() => token.value !== '' && !isSuccess.value && !isError.value);

onMounted((): void => {
   if (token.value !== '') {
      submitVerifyEmail({ token: token.value });
   }
});
</script>

<template>
   <div class="space-y-6 rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-ink-100 sm:p-10">
      <template v-if="isVerifying">
         <LoaderCircle class="mx-auto size-12 animate-spin text-brand-500" aria-hidden="true" />
         <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Đang xác thực email...</h1>
      </template>

      <template v-if="isSuccess">
         <CircleCheck class="mx-auto size-14 text-emerald-500" aria-hidden="true" />
         <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Xác thực email thành công</h1>
         <p class="text-[15px] text-ink-500">
            Email của bạn đã được xác thực. Bạn có thể liên kết đăng nhập Google với tài khoản này.
         </p>
         <BaseLinkButton :to="authStore.user ? '/profile' : '/login'" size="lg" full-width>
            {{ authStore.user ? 'Về hồ sơ của tôi' : 'Đăng nhập' }}
         </BaseLinkButton>
      </template>

      <template v-if="isError || token === ''">
         <CircleAlert class="mx-auto size-14 text-danger-500" aria-hidden="true" />
         <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Không thể xác thực email</h1>
         <p class="text-[15px] text-ink-500">{{ token === '' ? MISSING_TOKEN_MESSAGE : getErrorMessage(error) }}</p>
         <BaseLinkButton :to="authStore.user ? '/profile' : '/login'" size="lg" full-width>
            {{ authStore.user ? 'Về hồ sơ để gửi lại email' : 'Đăng nhập để gửi lại email' }}
         </BaseLinkButton>
      </template>
   </div>
</template>
