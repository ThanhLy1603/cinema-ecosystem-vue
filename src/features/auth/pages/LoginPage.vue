<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import { login } from '@/api/auth/authApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginResponse } from '@/types/auth/auth';
import { getPostLoginPath, getRedirectPath } from '../utils/redirect';

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const authStore = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string>('');
const isSubmitting = ref<boolean>(false);

async function handleSubmit(): Promise<void> {
   errorMessage.value = '';
   if (email.value.trim() === '' || password.value === '') {
      errorMessage.value = 'Vui lòng nhập email và mật khẩu.';
      return;
   }
   isSubmitting.value = true;
   try {
      const loginResponse: LoginResponse = await login({ email: email.value.trim(), password: password.value });
      authStore.setAuth(loginResponse.user);
      await router.replace(getPostLoginPath(getRedirectPath(route.query.redirect), loginResponse.user));
   } catch (error: unknown) {
      errorMessage.value = getErrorMessage(error);
   } finally {
      isSubmitting.value = false;
   }
}
</script>

<template>
   <form class="flex flex-col gap-4" novalidate @submit.prevent="handleSubmit">
      <h1 class="text-xl font-semibold text-slate-900">Đăng nhập</h1>
      <BaseAlert v-if="errorMessage" variant="error">{{ errorMessage }}</BaseAlert>
      <BaseTextField v-model="email" label="Email" type="email" autocomplete="email" placeholder="ban@example.com" />
      <BaseTextField v-model="password" label="Mật khẩu" type="password" autocomplete="current-password" />
      <BaseButton type="submit" :is-loading="isSubmitting">Đăng nhập</BaseButton>
   </form>
</template>
