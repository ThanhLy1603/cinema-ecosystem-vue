<script setup lang="ts">
import type { Facility } from '@/types/cinema/cinema';

interface FacilityPickerProps {
   facilities: Facility[];
   disabled?: boolean;
}

const props = withDefaults(defineProps<FacilityPickerProps>(), { disabled: false });

const selectedFacilityIds = defineModel<number[]>({ required: true });

function toggleFacility(facilityId: number): void {
   if (props.disabled) {
      return;
   }
   if (selectedFacilityIds.value.includes(facilityId)) {
      selectedFacilityIds.value = selectedFacilityIds.value.filter(
         (selectedFacilityId) => selectedFacilityId !== facilityId,
      );
      return;
   }
   selectedFacilityIds.value = [...selectedFacilityIds.value, facilityId];
}
</script>

<template>
   <p v-if="facilities.length === 0" class="text-sm text-ink-500">Chưa có tiện ích nào trong danh mục.</p>
   <fieldset v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2" :disabled="disabled">
      <legend class="sr-only">Tiện ích của rạp</legend>
      <label
         v-for="facility in facilities"
         :key="facility.id"
         class="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-200 px-4 py-3 text-sm transition-colors hover:border-brand-300 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50"
      >
         <input
            type="checkbox"
            :checked="selectedFacilityIds.includes(facility.id)"
            class="mt-0.5 size-4 accent-brand-600"
            @change="toggleFacility(facility.id)"
         />
         <span>
            <span class="block font-semibold text-ink-900">{{ facility.name }}</span>
            <span v-if="facility.description" class="block text-xs text-ink-500">{{ facility.description }}</span>
         </span>
      </label>
   </fieldset>
</template>
