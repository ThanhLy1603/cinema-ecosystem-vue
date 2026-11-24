<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { Lock, Mail, Phone, ShieldCheck, User as UserIcon, UserPlus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import {
   RouterLink,
   useRoute,
   useRouter,
   type LocationQueryRaw,
   type RouteLocationNormalizedLoaded,
   type Router,
} from 'vue-router';
import { login, register } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import {
   validateConfirmPassword,
   validateEmail,
   validateFullName,
   validateNewPassword,
   validatePhone,
} from '@/lib/auth/validation';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginResponse, RegisterRequest } from '@/types/auth/auth';
import GoogleAuthSection from '../components/GoogleAuthSection.vue';
import PasswordStrength from '../components/PasswordStrength.vue';
import { getRedirectPath } from '../utils/redirect';

interface RegisterFieldErrors {
   fullName?: string;
   email?: string;
   phone?: string;
   password?: string;
   confirmPassword?: string;
}

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const authStore = useAuthStore();

const fullName = ref<string>('');
const email = ref<string>('');
const phone = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const fieldErrors = ref<RegisterFieldErrors>({});

const redirectPath = computed<string>(() => getRedirectPath(route.query.redirect));
const loginLinkQuery = computed<LocationQueryRaw>(() => (route.query.redirect ? { redirect: redirectPath.value } : {}));

async function registerAndSignIn(registerRequest: RegisterRequest): Promise<LoginResponse> {
   await register(registerRequest);
   return login({ email: registerRequest.email, password: registerRequest.password });
}

function handleRegisterSuccess(loginResponse: LoginResponse): void {
   authStore.setAuth(loginResponse.user);
   void router.replace(redirectPath.value);
}

const {
   mutate: submitRegister,
   isPending,
   isError,
   error,
} = useMutation<LoginResponse, unknown, RegisterRequest>({
   mutationFn: registerAndSignIn,
   onSuccess: handleRegisterSuccess,
});

const serverFieldErrors = computed<Record<string, string>>(() => {
   if (!isError.value) {
      return {};
   }
   const fieldErrorsFromServer: Record<string, string> = { ...getFieldErrors(error.value) };
   const errorCode: string | null = getErrorCode(error.value);
   if (errorCode === 'EMAIL_ALREADY_EXISTS') {
      fieldErrorsFromServer.email = getErrorMessage(error.value);
   }
   if (errorCode === 'PHONE_ALREADY_EXISTS') {
      fieldErrorsFromServer.phone = getErrorMessage(error.value);
   }
   return fieldErrorsFromServer;
});
const hasServerFieldErrors = computed<boolean>(() => Object.keys(serverFieldErrors.value).length > 0);

function handleSubmit(): void {
   const nextFieldErrors: RegisterFieldErrors = {
      fullName: validateFullName(fullName.value),
      email: validateEmail(email.value),
      phone: validatePhone(phone.value),
      password: validateNewPassword(password.value),
      confirmPassword: validateConfirmPassword(password.value, confirmPassword.value),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((fieldError) => fieldError !== undefined)) {
      return;
   }
   const trimmedPhone: string = phone.value.trim();
   submitRegister({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      ...(trimmedPhone.length > 0 ? { phone: trimmedPhone } : {}),
   });
}
</script>

<template>
   <div class="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
      <div class="mb-8 space-y-2">
         <div
            class="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-100 text-brand-600"
         >
            <UserPlus class="size-6" aria-hidden="true" />
         </div>
         <h1 class="pt-2 text-3xl font-extrabold tracking-tight text-ink-900">Tạo tài khoản</h1>
         <p class="text-[15px] text-ink-500">Chỉ mất một phút để trở thành thành viên của CinemaSphere.</p>
      </div>

      <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
         <BaseAlert v-if="isError && !hasServerFieldErrors" variant="error">{{ getErrorMessage(error) }}</BaseAlert>

         <BaseTextField
            id="fullName"
            v-model="fullName"
            label="Họ và tên"
            :icon="UserIcon"
            placeholder="Nguyễn Văn A"
            autocomplete="name"
            :error="fieldErrors.fullName ?? serverFieldErrors.fullName"
            :disabled="isPending"
            auto-focus
         />
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
         />
         <BaseTextField
            id="phone"
            v-model="phone"
            label="Số điện thoại"
            type="tel"
            :icon="Phone"
            placeholder="0901234567"
            autocomplete="tel"
            optional
            :error="fieldErrors.phone ?? serverFieldErrors.phone"
            :disabled="isPending"
         />
         <div class="space-y-3">
            <BaseTextField
               id="password"
               v-model="password"
               label="Mật khẩu"
               type="password"
               :icon="Lock"
               placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
               autocomplete="new-password"
               :error="fieldErrors.password ?? serverFieldErrors.password"
               :disabled="isPending"
            />
            <PasswordStrength :password="password" />
         </div>
         <BaseTextField
            id="confirmPassword"
            v-model="confirmPassword"
            label="Nhập lại mật khẩu"
            type="password"
            :icon="ShieldCheck"
            placeholder="Nhập lại mật khẩu"
            autocomplete="new-password"
            :error="fieldErrors.confirmPassword"
            :disabled="isPending"
         />

         <BaseButton type="submit" size="lg" full-width :is-loading="isPending">
            {{ isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản' }}
         </BaseButton>
      </form>

      <GoogleAuthSection />

      <p class="mt-8 text-center text-sm text-ink-500">
         Đã có tài khoản?
         <RouterLink
            :to="{ name: 'login', query: loginLinkQuery }"
            class="font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
         >
            Đăng nhập
         </RouterLink>
      </p>
   </div>
</template>
