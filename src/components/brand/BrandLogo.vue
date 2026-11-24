<script setup lang="ts">
import { Film, Ticket } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { cn } from '@/lib/common/utils';
import { useRootAttrs, type RootAttrs } from '@/lib/common/useRootAttrs';

defineOptions({ inheritAttrs: false });

interface BrandLogoProps {
   tone?: 'default' | 'light';
   variant?: 'flat' | 'cinema';
   to?: string;
}

const props = withDefaults(defineProps<BrandLogoProps>(), { tone: 'default', variant: 'flat', to: '/' });

const rootAttrs: RootAttrs = useRootAttrs();

function isLight(): boolean {
   return props.tone === 'light';
}
</script>

<template>
   <RouterLink
      v-if="variant === 'cinema'"
      v-bind="rootAttrs.getRestAttrs()"
      :to="to"
      aria-label="CinemaSphere - Trang chủ"
      :class="rootAttrs.mergeRootClass('group inline-flex shrink-0 items-center gap-2 sm:gap-3')"
   >
      <span
         class="grid size-10 place-items-center rounded-xl text-white shadow-glow transition-transform [background:var(--cta-bg)] group-hover:scale-105"
      >
         <Film class="size-5" aria-hidden="true" />
      </span>
      <span class="flex flex-col leading-tight max-[359px]:hidden">
         <span
            :class="
               cn(
                  'text-lg font-extrabold uppercase tracking-wider sm:text-xl',
                  isLight() ? 'text-white' : 'text-ink-900',
               )
            "
         >
            Cinema <span :class="isLight() ? 'text-brand-400' : 'text-brand-600'">Sphere</span>
         </span>
         <span
            :class="
               cn(
                  'hidden text-[10px] font-semibold uppercase tracking-widest sm:block',
                  isLight() ? 'text-white/50' : 'text-ink-500',
               )
            "
         >
            Đặt vé xem phim trực tuyến
         </span>
      </span>
   </RouterLink>

   <RouterLink
      v-else
      v-bind="rootAttrs.getRestAttrs()"
      :to="to"
      aria-label="CinemaSphere - Trang chủ"
      :class="rootAttrs.mergeRootClass('group inline-flex items-center gap-2.5')"
   >
      <span
         :class="
            cn(
               'relative grid size-9 place-items-center rounded-lg text-white',
               isLight() ? 'bg-white/20 ring-1 ring-white/40 backdrop-blur' : 'bg-brand-600',
            )
         "
      >
         <Ticket class="size-[18px]" aria-hidden="true" />
      </span>
      <span :class="cn('text-lg font-bold tracking-tight', isLight() ? 'text-white' : 'text-ink-900')">
         Cinema<span :class="isLight() ? 'text-accent-300' : 'text-brand-600'">Sphere</span>
      </span>
   </RouterLink>
</template>
