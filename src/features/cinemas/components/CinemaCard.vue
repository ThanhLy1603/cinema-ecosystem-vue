<script setup lang="ts">
import { Armchair, MapPin, Navigation, Phone } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import type { Cinema } from '@/types/cinema/cinema';
import { buildMapUrl } from '../utils/mapLink';
import FacilityChips from './FacilityChips.vue';

interface CinemaCardProps {
   cinema: Cinema;
}

defineProps<CinemaCardProps>();
</script>

<template>
   <article
      class="flex h-full flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
   >
      <div class="space-y-1">
         <span class="text-xs font-bold uppercase tracking-wider text-brand-600">{{ cinema.city }}</span>
         <h2 class="text-xl font-bold text-ink-900">
            <RouterLink :to="`/cinemas/${cinema.slug}`" class="hover:text-brand-700">{{ cinema.name }}</RouterLink>
         </h2>
      </div>

      <ul class="space-y-2 text-sm text-ink-600">
         <li class="flex items-start gap-2">
            <MapPin class="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden="true" />
            <span>{{ cinema.address }}</span>
         </li>
         <li v-if="cinema.phone" class="flex items-center gap-2">
            <Phone class="size-4 shrink-0 text-ink-400" aria-hidden="true" />
            <a :href="`tel:${cinema.phone}`" class="font-medium hover:text-brand-700">{{ cinema.phone }}</a>
         </li>
         <li class="flex items-center gap-2">
            <Armchair class="size-4 shrink-0 text-ink-400" aria-hidden="true" />
            <span>{{ cinema.hallCount }} phòng chiếu</span>
         </li>
      </ul>

      <FacilityChips :facilities="cinema.facilities" />

      <div class="mt-auto flex flex-wrap items-center gap-4 pt-2 text-sm font-semibold">
         <RouterLink :to="`/cinemas/${cinema.slug}`" class="text-brand-700 hover:underline">Xem chi tiết</RouterLink>
         <a
            v-if="cinema.latitude !== null && cinema.longitude !== null"
            :href="buildMapUrl(cinema.latitude, cinema.longitude)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-700"
         >
            <Navigation class="size-4" aria-hidden="true" />
            Chỉ đường
         </a>
      </div>
   </article>
</template>
