<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
   <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header class="border-b border-slate-200 bg-white">
         <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <span class="text-lg font-bold text-emerald-700">Nhân viên rạp</span>
            <RouterLink :to="{ name: 'home' }" class="text-sm font-medium text-slate-600 hover:text-slate-900">
               Về trang chủ
            </RouterLink>
         </div>
      </header>
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
         <RouterView />
      </main>
   </div>
</template>
