<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BrandLogo from '@/components/brand/BrandLogo.vue';
import BaseLinkButton from '@/components/ui/BaseLinkButton.vue';
import { useScrolled } from '@/lib/common/useScrolled';
import { cn } from '@/lib/common/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import CitySelector from './CitySelector.vue';
import UserMenu from './UserMenu.vue';

interface NavItem {
   label: string;
   to: string;
}

const NAV_ITEMS: NavItem[] = [
   { label: 'Phim', to: '/movies' },
   { label: 'Thức ăn và nước', to: '/fnb' },
   { label: 'Ưu đãi và khuyến mãi', to: '/promotions' },
   { label: 'Cộng đồng', to: '/community' },
   { label: 'Giới thiệu', to: '/about' },
];

const isMobileMenuOpen = ref<boolean>(false);
const isScrolled = useScrolled();
const authStore = useAuthStore();

function getNavLinkClassName(isActive: boolean): string {
   return cn(
      'group relative whitespace-nowrap px-2 py-2 text-[13px] 2xl:px-3 font-semibold uppercase tracking-wide transition-colors',
      isActive ? 'text-brand-600' : 'text-ink-900 hover:text-brand-600',
   );
}

function toggleMobileMenu(): void {
   isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu(): void {
   isMobileMenuOpen.value = false;
}
</script>

<template>
   <header class="sticky top-0 z-40 w-full">
      <div
         :class="
            cn(
               'flex h-16 w-full items-center gap-2 border-b border-white/70 px-3 backdrop-blur-xl transition-all duration-300 sm:gap-4 sm:px-8 lg:px-12',
               isScrolled ? 'bg-white/90 shadow-md shadow-ink-900/10' : 'bg-white/70',
            )
         "
      >
         <BrandLogo variant="cinema" />

         <nav class="ml-4 hidden items-center gap-1 xl:flex 2xl:ml-10 2xl:gap-3" aria-label="Điều hướng chính">
            <RouterLink
               v-for="navItem in NAV_ITEMS"
               :key="navItem.to"
               v-slot="{ href, navigate, isActive }"
               :to="navItem.to"
               custom
            >
               <a :href="href" :class="getNavLinkClassName(isActive)" @click="navigate">
                  {{ navItem.label }}
                  <span
                     :class="
                        cn(
                           'absolute inset-x-2 -bottom-1 h-0.5 origin-left rounded-full bg-brand-600 transition-transform duration-300 2xl:inset-x-3',
                           isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )
                     "
                  />
               </a>
            </RouterLink>
         </nav>

         <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <div class="hidden sm:block">
               <CitySelector />
            </div>
            <span v-if="authStore.isLoading" class="h-10 w-40 animate-pulse rounded-xl bg-ink-100" aria-hidden="true" />
            <UserMenu v-else-if="authStore.user" :user="authStore.user" />
            <BaseLinkButton
               v-else
               to="/login"
               size="sm"
               class="hidden rounded-xl px-5 text-xs font-bold uppercase sm:inline-flex"
            >
               <span class="2xl:hidden">Đăng nhập</span>
               <span class="hidden 2xl:inline">Đăng ký / Đăng nhập</span>
            </BaseLinkButton>

            <button
               type="button"
               :aria-label="isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'"
               :aria-expanded="isMobileMenuOpen"
               class="grid size-10 place-items-center rounded-xl text-ink-800 transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 xl:hidden"
               @click="toggleMobileMenu"
            >
               <X v-if="isMobileMenuOpen" class="size-6" />
               <Menu v-else class="size-6" />
            </button>
         </div>
      </div>

      <div
         v-if="isMobileMenuOpen"
         class="w-full space-y-4 border-b border-ink-100 bg-white/95 px-4 pb-5 pt-4 shadow-lg backdrop-blur-xl xl:hidden"
      >
         <div class="sm:hidden">
            <CitySelector />
         </div>
         <nav class="flex flex-col gap-1" aria-label="Điều hướng di động">
            <RouterLink
               v-for="navItem in NAV_ITEMS"
               :key="navItem.to"
               :to="navItem.to"
               class="rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide text-ink-800 transition-colors hover:bg-brand-50 hover:text-brand-700"
               @click="closeMobileMenu"
            >
               {{ navItem.label }}
            </RouterLink>
         </nav>
         <div v-if="!authStore.user && !authStore.isLoading" class="grid grid-cols-2 gap-2">
            <BaseLinkButton to="/login" variant="secondary" @click="closeMobileMenu">Đăng nhập</BaseLinkButton>
            <BaseLinkButton to="/register" @click="closeMobileMenu">Đăng ký</BaseLinkButton>
         </div>
      </div>
   </header>
</template>
