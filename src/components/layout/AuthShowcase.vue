<script setup lang="ts">
import { Armchair, Crown, QrCode, Star } from 'lucide-vue-next';
import type { Component } from 'vue';
import BrandLogo from '@/components/brand/BrandLogo.vue';

interface ShowcaseBenefit {
   icon: Component;
   title: string;
   description: string;
}

const SHOWCASE_BENEFITS: ShowcaseBenefit[] = [
   { icon: Armchair, title: 'Chọn ghế realtime', description: 'Giữ chỗ tức thì, không lo trùng ghế' },
   { icon: QrCode, title: 'Vé QR điện tử', description: 'Quét mã là vào phòng chiếu' },
   { icon: Crown, title: 'Tích điểm thành viên', description: 'Mỗi lần xem phim là một lần tích lũy' },
];

const FILM_STRIP_STYLE: Record<string, string> = {
   backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.55) 0 14px, transparent 14px 30px)',
   backgroundSize: '6px 30px',
   backgroundRepeat: 'repeat-y',
   backgroundPosition: '3px 8px',
};
</script>

<template>
   <aside
      class="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16"
   >
      <div class="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-accent-300/30 blur-3xl" />
      <div
         class="pointer-events-none absolute -bottom-32 -right-20 size-[28rem] rounded-full bg-brand-800/30 blur-3xl"
      />
      <div
         class="pointer-events-none absolute inset-y-0 left-0 w-3 opacity-70"
         :style="FILM_STRIP_STYLE"
         aria-hidden="true"
      />
      <div
         class="pointer-events-none absolute inset-y-0 right-0 w-3 opacity-70"
         :style="FILM_STRIP_STYLE"
         aria-hidden="true"
      />

      <div class="relative z-10">
         <BrandLogo tone="light" variant="cinema" />
      </div>

      <div class="relative z-10 max-w-lg space-y-8">
         <div class="space-y-4">
            <span
               class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/30 backdrop-blur"
            >
               <Star class="size-3.5 fill-accent-300 text-accent-300" aria-hidden="true" />
               Trải nghiệm điện ảnh trọn vẹn
            </span>
            <h2 class="text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-[2.75rem]">
               Mỗi bộ phim hay
               <br />
               bắt đầu từ một <span class="text-accent-300">tấm vé</span>.
            </h2>
            <p class="text-base leading-relaxed text-white/85">
               Đặt vé nhanh, theo dõi lịch sử xem phim và nhận ưu đãi dành riêng cho thành viên CinemaSphere.
            </p>
         </div>

         <ul class="space-y-3">
            <li
               v-for="showcaseBenefit in SHOWCASE_BENEFITS"
               :key="showcaseBenefit.title"
               class="flex items-center gap-4 rounded-2xl bg-white/12 px-4 py-3.5 ring-1 ring-white/25 backdrop-blur-sm"
            >
               <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <component :is="showcaseBenefit.icon" class="size-5" aria-hidden="true" />
               </span>
               <div>
                  <p class="text-sm font-bold text-white">{{ showcaseBenefit.title }}</p>
                  <p class="text-[13px] text-white/80">{{ showcaseBenefit.description }}</p>
               </div>
            </li>
         </ul>
      </div>

      <div class="relative z-10 flex items-center gap-3 text-sm text-white/75">
         <span class="h-px w-10 bg-white/50" />
         Đặt vé xem phim trực tuyến
      </div>
   </aside>
</template>
