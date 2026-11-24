<script setup lang="ts">
import { Armchair, ArrowRight, Crown, QrCode, Star } from 'lucide-vue-next';
import type { Component } from 'vue';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';

interface HomeBenefit {
   icon: Component;
   title: string;
   description: string;
}

const HOME_BENEFITS: HomeBenefit[] = [
   { icon: Armchair, title: 'Chọn ghế realtime', description: 'Giữ chỗ tức thì, không lo trùng ghế với người khác.' },
   { icon: QrCode, title: 'Vé QR điện tử', description: 'Quét mã là vào phòng chiếu, không cần in vé.' },
   { icon: Crown, title: 'Tích điểm thành viên', description: 'Mỗi lần xem phim là một lần tích lũy điểm thưởng.' },
];
</script>

<template>
   <div class="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:px-12 lg:py-20">
      <section class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
         <div class="space-y-6">
            <span
               class="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200"
            >
               <Star class="size-3.5 fill-accent-400 text-accent-400" aria-hidden="true" />
               Trải nghiệm điện ảnh trọn vẹn
            </span>
            <h1 class="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
               Mỗi bộ phim hay bắt đầu từ một <span class="text-brand-600">tấm vé</span>.
            </h1>
            <p class="max-w-xl text-lg leading-relaxed text-ink-600">
               Đặt vé xem phim trực tuyến nhanh chóng, chọn ghế theo thời gian thực và nhận vé điện tử ngay trên điện
               thoại.
            </p>
            <div class="flex flex-wrap gap-3">
               <BaseLinkButton to="/movies" size="lg" :icon="ArrowRight">Xem phim đang chiếu</BaseLinkButton>
               <BaseLinkButton to="/cinemas" size="lg" variant="secondary">Hệ thống rạp</BaseLinkButton>
            </div>
         </div>

         <div class="relative hidden lg:block" aria-hidden="true">
            <div class="absolute -left-6 -top-6 size-48 animate-float rounded-full bg-accent-200/50 blur-3xl" />
            <div class="absolute -bottom-8 right-0 size-56 animate-float-slow rounded-full bg-brand-300/40 blur-3xl" />
            <div
               class="relative grid aspect-[4/3] place-items-center rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 shadow-soft"
            >
               <div class="space-y-2 text-center text-white">
                  <p class="text-sm font-semibold uppercase tracking-widest text-white/70">Cinema Sphere</p>
                  <p class="text-4xl font-extrabold">Vé của bạn</p>
               </div>
            </div>
         </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
         <article
            v-for="homeBenefit in HOME_BENEFITS"
            :key="homeBenefit.title"
            class="space-y-3 rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-transform hover:-translate-y-1"
         >
            <span class="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
               <component :is="homeBenefit.icon" class="size-6" aria-hidden="true" />
            </span>
            <h2 class="text-lg font-bold text-ink-900">{{ homeBenefit.title }}</h2>
            <p class="text-sm leading-relaxed text-ink-500">{{ homeBenefit.description }}</p>
         </article>
      </section>
   </div>
</template>
