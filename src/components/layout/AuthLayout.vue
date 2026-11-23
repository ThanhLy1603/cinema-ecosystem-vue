<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
   <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10">
      <RouterLink :to="{ name: 'home' }" class="text-xl font-bold text-emerald-700">Cinema Ecosystem</RouterLink>
      <main class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
         <RouterView />
      </main>
   </div>
</template>
