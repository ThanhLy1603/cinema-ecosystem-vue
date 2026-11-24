<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { Lock, LogIn, Mail } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import {
   RouterLink,
   useRoute,
   useRouter,
   type LocationQueryRaw,
   type RouteLocationNormalizedLoaded,
   type Router,
} from 'vue-router';
import { login } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { validateEmail, validateLoginPassword } from '@/lib/auth/validation';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginRequest, LoginResponse } from '@/types/auth/auth';
import { PASSWORD_RESET_NOTICE } from '../utils/loginNotice';
import { getPostLoginPath, getRedirectPath } from '../utils/redirect';

interface LoginFieldErrors {
   email?: string;
   password?: string;
}

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const authStore = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const fieldErrors = ref<LoginFieldErrors>({});

const redirectPath = computed<string>(() => getRedirectPath(route.query.redirect));
const isRedirectedFromProtectedPage = computed<boolean>(() => redirectPath.value !== '/');
const isPasswordResetNotice = computed<boolean>(() => route.query.notice === PASSWORD_RESET_NOTICE);
const registerLinkQuery = computed<LocationQueryRaw>(() =>
   route.query.redirect ? { redirect: redirectPath.value } : {},
);

function handleLoginSuccess(loginResponse: LoginResponse): void {
   authStore.setAuth(loginResponse.user);
   void router.replace(getPostLoginPath(redirectPath.value, loginResponse.user));
}

const {
   mutate: submitLogin,
   isPending,
   isError,
   error,
} = useMutation<LoginResponse, unknown, LoginRequest>({
   mutationFn: login,
   onSuccess: handleLoginSuccess,
});

const serverFieldErrors = computed<Record<string, string>>(() => (isError.value ? getFieldErrors(error.value) : {}));
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);

function handleSubmit(): void {
   const nextFieldErrors: LoginFieldErrors = {
      email: validateEmail(email.value),
      password: validateLoginPassword(password.value),
   };
   fieldErrors.value = nextFieldErrors;
   if (nextFieldErrors.email || nextFieldErrors.password) {
      return;
   }
   submitLogin({ email: email.value.trim(), password: password.value });
}
</script>

<template>
   <div class="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
      <div class="mb-8 space-y-2">
         <div
            class="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-100 text-brand-600"
         >
            <LogIn class="size-6" aria-hidden="true" />
         </div>
         <h1 class="pt-2 text-3xl font-extrabold tracking-tight text-ink-900">Chào mừng trở lại</h1>
         <p class="text-[15px] text-ink-500">Đăng nhập để tiếp tục đặt vé và quản lý tài khoản của bạn.</p>
      </div>

      <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
         <BaseAlert v-if="isPasswordResetNotice && !isError" variant="success">
            Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.
         </BaseAlert>
         <BaseAlert v-if="isRedirectedFromProtectedPage && !isPasswordResetNotice && !isError" variant="info">
            Vui lòng đăng nhập để tiếp tục.
         </BaseAlert>
         <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>

         <BaseTextField
            id="email"
            v-model="email"
            label="Email"
            type="email"
            :icon="Mail"
            placeholder="ban@example.com"
            autocomplete="email"
            :error="fieldErrors.email ?? serverFieldErrors.email"
            :disabled="isPending"
            auto-focus
         />
         <BaseTextField
            id="password"
            v-model="password"
            label="Mật khẩu"
            type="password"
            :icon="Lock"
            placeholder="Nhập mật khẩu"
            autocomplete="current-password"
            :error="fieldErrors.password ?? serverFieldErrors.password"
            :disabled="isPending"
         />
         <div class="-mt-2 text-right">
            <RouterLink
               to="/forgot-password"
               class="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
            >
               Quên mật khẩu?
            </RouterLink>
         </div>

         <BaseButton type="submit" size="lg" full-width :is-loading="isPending">
            {{ isPending ? 'Đang đăng nhập...' : 'Đăng nhập' }}
         </BaseButton>
      </form>

      <p class="mt-8 text-center text-sm text-ink-500">
         Chưa có tài khoản?
         <RouterLink
            :to="{ name: 'register', query: registerLinkQuery }"
            class="font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
         >
            Đăng ký ngay
         </RouterLink>
      </p>
   </div>
</template>
