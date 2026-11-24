<script setup lang="ts">
import { RouterView } from 'vue-router';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
</script>

<template>
   <div v-if="authStore.isLoading" class="theme-shinkai app-backdrop flex min-h-dvh items-center justify-center">
      <FullPageSpinner />
   </div>
   <RouterView v-else />
</template>
