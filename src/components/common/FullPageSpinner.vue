<script setup lang="ts">
import { Ticket } from 'lucide-vue-next';
</script>

<template>
   <div class="theme-shinkai grid min-h-[60vh] place-items-center" role="status" aria-label="Đang tải">
      <div class="flex flex-col items-center gap-4">
         <div class="relative grid size-16 place-items-center">
            <span class="absolute inset-0 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
            <Ticket class="size-6 text-brand-600" aria-hidden="true" />
         </div>
         <p class="text-sm font-medium text-ink-500">Đang chuẩn bị rạp chiếu...</p>
      </div>
   </div>
</template>
