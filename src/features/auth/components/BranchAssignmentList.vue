<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
import type { BranchAssignment } from '@/types/auth/profile';

interface BranchAssignmentListProps {
   branchAssignments: BranchAssignment[];
}

defineProps<BranchAssignmentListProps>();
</script>

<template>
   <ul class="space-y-3">
      <li
         v-for="branchAssignment in branchAssignments"
         :key="branchAssignment.cinemaId"
         class="flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-900"
      >
         <MapPin class="size-4 shrink-0 text-brand-700" aria-hidden="true" />
         <span class="min-w-0 flex-1 truncate font-semibold">
            {{ branchAssignment.cinemaName ?? `Chi nhánh #${branchAssignment.cinemaId}` }}
         </span>
         <span
            v-if="branchAssignment.primary"
            class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700"
         >
            Chi nhánh chính
         </span>
      </li>
   </ul>
</template>
