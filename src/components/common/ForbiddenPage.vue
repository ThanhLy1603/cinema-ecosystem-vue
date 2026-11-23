<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
   <section class="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p class="text-6xl font-bold text-emerald-600">403</p>
      <h1 class="text-2xl font-semibold text-slate-900">Bạn không có quyền truy cập trang này</h1>
      <p class="text-slate-600">Tài khoản hiện tại không đủ quyền để xem nội dung này.</p>
      <RouterLink
         :to="{ name: 'home' }"
         class="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
         Về trang chủ
      </RouterLink>
   </section>
</template>
