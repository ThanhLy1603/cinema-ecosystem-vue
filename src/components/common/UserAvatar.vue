<script setup lang="ts">
import { ref } from 'vue';
import { getInitials } from '@/lib/auth/initials';
import { useRootAttrs, type RootAttrs } from '@/lib/common/useRootAttrs';

defineOptions({ inheritAttrs: false });

interface UserAvatarProps {
   fullName: string;
   avatarUrl?: string;
}

defineProps<UserAvatarProps>();

const rootAttrs: RootAttrs = useRootAttrs();
const hasImageFailed = ref<boolean>(false);

function markImageFailed(): void {
   hasImageFailed.value = true;
}
</script>

<template>
   <img
      v-if="avatarUrl && !hasImageFailed"
      v-bind="rootAttrs.getRestAttrs()"
      :src="avatarUrl"
      :alt="fullName"
      :class="rootAttrs.mergeRootClass('size-10 rounded-full object-cover ring-2 ring-white')"
      @error="markImageFailed"
   />
   <span
      v-else
      v-bind="rootAttrs.getRestAttrs()"
      aria-hidden="true"
      :class="
         rootAttrs.mergeRootClass(
            'grid size-10 place-items-center rounded-full bg-gradient-to-br from-accent-300 to-brand-500 text-sm font-bold text-white ring-2 ring-white',
         )
      "
   >
      {{ getInitials(fullName) }}
   </span>
</template>
