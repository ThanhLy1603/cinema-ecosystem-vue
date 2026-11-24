<script setup lang="ts">
import type { Component } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/lib/common/buttonStyles';
import { useRootAttrs, type RootAttrs } from '@/lib/common/useRootAttrs';

defineOptions({ inheritAttrs: false });

interface BaseLinkButtonProps {
   to: RouteLocationRaw;
   variant?: ButtonVariant;
   size?: ButtonSize;
   fullWidth?: boolean;
   icon?: Component;
}

const props = withDefaults(defineProps<BaseLinkButtonProps>(), {
   variant: 'primary',
   size: 'md',
   fullWidth: false,
   icon: undefined,
});

const rootAttrs: RootAttrs = useRootAttrs();

function getLinkClass(): string {
   return rootAttrs.mergeRootClass(buttonClasses(props.variant, props.size, props.fullWidth, undefined));
}
</script>

<template>
   <RouterLink v-bind="rootAttrs.getRestAttrs()" :to="to" :class="getLinkClass()">
      <component :is="icon" v-if="icon" class="size-4" aria-hidden="true" />
      <slot />
   </RouterLink>
</template>
