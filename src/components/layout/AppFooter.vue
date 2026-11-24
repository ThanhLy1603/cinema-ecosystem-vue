<script setup lang="ts">
import { CreditCard, Mail, MapPin, Phone } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import BrandLogo from '@/components/brand/BrandLogo.vue';

interface FooterLink {
   label: string;
   to: string;
}

interface FooterColumn {
   title: string;
   footerLinks: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
   {
      title: 'Khám phá',
      footerLinks: [
         { label: 'Phim đang chiếu', to: '/movies' },
         { label: 'Phim sắp chiếu', to: '/movies?status=COMING_SOON' },
         { label: 'Hệ thống rạp', to: '/cinemas' },
         { label: 'Giới thiệu', to: '/about' },
         { label: 'Khuyến mãi', to: '/promotions' },
      ],
   },
   {
      title: 'Tài khoản',
      footerLinks: [
         { label: 'Đăng nhập', to: '/login' },
         { label: 'Đăng ký thành viên', to: '/register' },
         { label: 'Vé của tôi', to: '/tickets' },
         { label: 'Cộng đồng & Blog', to: '/community' },
      ],
   },
];

const PAYMENT_PARTNERS: string[] = ['MoMo', 'VNPAY', 'VietQR', 'Visa / Master'];
</script>

<template>
   <footer class="mt-10 bg-[#dfeae7] text-ink-700">
      <div class="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:px-12">
         <div
            class="grid grid-cols-1 gap-8 border-b border-ink-200 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]"
         >
            <div class="space-y-3">
               <BrandLogo variant="cinema" />
               <p class="max-w-xs text-sm leading-relaxed text-ink-700">
                  Đặt vé xem phim trực tuyến nhanh chóng, chọn ghế theo thời gian thực và nhận vé điện tử ngay trên điện
                  thoại.
               </p>
            </div>

            <div v-for="footerColumn in FOOTER_COLUMNS" :key="footerColumn.title" class="space-y-3">
               <h3 class="text-sm font-extrabold uppercase tracking-wide text-ink-900">{{ footerColumn.title }}</h3>
               <ul class="space-y-2 text-sm">
                  <li v-for="footerLink in footerColumn.footerLinks" :key="footerLink.to">
                     <RouterLink :to="footerLink.to" class="text-ink-800 transition-colors hover:text-brand-600">
                        {{ footerLink.label }}
                     </RouterLink>
                  </li>
               </ul>
            </div>

            <div class="space-y-3">
               <h3 class="text-sm font-extrabold uppercase tracking-wide text-ink-900">Chăm sóc khách hàng</h3>
               <ul class="space-y-2 text-sm text-ink-800">
                  <li class="flex items-center gap-1.5">
                     <Phone class="size-3.5 text-ink-800" aria-hidden="true" />
                     Hotline hỗ trợ
                  </li>
                  <li class="flex items-center gap-1.5">
                     <Mail class="size-3.5 text-ink-800" aria-hidden="true" />
                     Email hỗ trợ khách hàng
                  </li>
                  <li class="flex items-center gap-1.5">
                     <MapPin class="size-3.5 text-ink-800" aria-hidden="true" />
                     Hệ thống rạp toàn quốc
                  </li>
                  <li class="flex items-center gap-1.5">
                     <CreditCard class="size-3.5 text-ink-800" aria-hidden="true" />
                     Đối tác thanh toán
                  </li>
               </ul>
               <ul class="flex flex-wrap gap-1.5">
                  <li
                     v-for="paymentPartner in PAYMENT_PARTNERS"
                     :key="paymentPartner"
                     class="rounded border border-ink-300 bg-white px-2 py-0.5 text-[11px] text-ink-700"
                  >
                     {{ paymentPartner }}
                  </li>
               </ul>
            </div>
         </div>

         <p class="pt-6 text-center text-xs text-ink-500">© 2026 CinemaSphere. Mọi quyền được bảo lưu.</p>
      </div>
   </footer>
</template>
