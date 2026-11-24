<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import { loginWithGoogle } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { cn } from '@/lib/common/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import type { GoogleLoginRequest, LoginResponse } from '@/types/auth/auth';
import { mountGoogleButton } from '../services/googleButtonService';
import { getPostLoginPath, getRedirectPath } from '../utils/redirect';

const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
const SCRIPT_ERROR_MESSAGE: string = 'Không tải được nút đăng nhập Google. Vui lòng kiểm tra kết nối và tải lại trang.';

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const authStore = useAuthStore();

const buttonContainer = ref<HTMLElement | null>(null);
const hasScriptError = ref<boolean>(false);
let unmountGoogleButton: (() => void) | null = null;

function handleGoogleLoginSuccess(loginResponse: LoginResponse): void {
   authStore.setAuth(loginResponse.user);
   void router.replace(getPostLoginPath(getRedirectPath(route.query.redirect), loginResponse.user));
}

const {
   mutate: submitGoogleLogin,
   isPending,
   isError,
   error,
} = useMutation<LoginResponse, unknown, GoogleLoginRequest>({
   mutationFn: loginWithGoogle,
   onSuccess: handleGoogleLoginSuccess,
});

function handleCredential(idToken: string): void {
   submitGoogleLogin({ idToken });
}

function handleScriptError(): void {
   hasScriptError.value = true;
}

onMounted((): void => {
   if (GOOGLE_CLIENT_ID !== '' && buttonContainer.value) {
      unmountGoogleButton = mountGoogleButton(
         buttonContainer.value,
         GOOGLE_CLIENT_ID,
         handleCredential,
         handleScriptError,
      );
   }
});

onBeforeUnmount((): void => {
   unmountGoogleButton?.();
});
</script>

<template>
   <div v-if="GOOGLE_CLIENT_ID !== ''" class="mt-6 space-y-4">
      <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
         <span class="h-px flex-1 bg-ink-100" />
         hoặc
         <span class="h-px flex-1 bg-ink-100" />
      </div>

      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <BaseAlert v-if="hasScriptError" variant="error">{{ SCRIPT_ERROR_MESSAGE }}</BaseAlert>

      <div
         ref="buttonContainer"
         :aria-busy="isPending"
         :class="
            cn(
               'flex min-h-[44px] w-full max-w-full justify-center transition-opacity',
               isPending && 'pointer-events-none opacity-50',
            )
         "
      />
      <p v-if="isPending" class="text-center text-sm text-ink-500">Đang đăng nhập bằng Google...</p>
   </div>
</template>
