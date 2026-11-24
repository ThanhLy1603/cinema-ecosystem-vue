<script setup lang="ts">
import type { Facility } from '@/types/cinema/cinema';

interface FacilityChipsProps {
   facilities: Facility[];
}

defineProps<FacilityChipsProps>();
</script>

<template>
   <ul v-if="facilities.length > 0" class="flex flex-wrap gap-2">
      <li
         v-for="facility in facilities"
         :key="facility.id"
         class="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-ink-800 ring-1 ring-accent-200"
      >
         <img v-if="facility.iconUrl" :src="facility.iconUrl" alt="" class="size-4 object-contain" />
         {{ facility.name }}
      </li>
   </ul>
</template>
