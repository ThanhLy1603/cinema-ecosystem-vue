<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';
</script>

<template>
   <section class="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div class="space-y-6">
         <span
            class="mx-auto grid size-20 place-items-center rounded-3xl bg-danger-50 text-danger-600 shadow-card ring-1 ring-danger-100"
         >
            <ShieldAlert class="size-10" aria-hidden="true" />
         </span>
         <div class="space-y-2">
            <p class="text-sm font-bold uppercase tracking-widest text-danger-600">Lỗi 403</p>
            <h1 class="text-3xl font-extrabold tracking-tight text-ink-900">Bạn không có quyền truy cập</h1>
            <p class="mx-auto max-w-md text-ink-500">
               Tài khoản của bạn chưa được cấp quyền để xem trang này. Nếu cần hỗ trợ, vui lòng liên hệ quản trị viên.
            </p>
         </div>
         <BaseLinkButton to="/">Về trang chủ</BaseLinkButton>
      </div>
   </section>
</template>
