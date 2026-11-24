<script setup lang="ts">
import { RouterView, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import AppFooter from './AppFooter.vue';
import AppNavbar from './AppNavbar.vue';
import ScrollToTopButton from './ScrollToTopButton.vue';

const route: RouteLocationNormalizedLoaded = useRoute();
</script>

<template>
   <div class="theme-shinkai app-backdrop flex min-h-dvh flex-col">
      <AppNavbar />
      <main :key="route.path" class="flex-1 animate-fade-in">
         <RouterView />
      </main>
      <AppFooter />
      <ScrollToTopButton />
   </div>
</template>
