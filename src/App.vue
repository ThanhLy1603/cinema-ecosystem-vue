<script setup lang="ts">
import { RouterView } from 'vue-router';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
</script>

<template>
   <FullPageSpinner v-if="authStore.isLoading" />
   <RouterView v-else />
</template>
