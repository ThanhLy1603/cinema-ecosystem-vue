<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/lib/common/buttonStyles';
import { useRootAttrs, type RootAttrs } from '@/lib/common/useRootAttrs';

defineOptions({ inheritAttrs: false });

interface BaseButtonProps {
   variant?: ButtonVariant;
   size?: ButtonSize;
   isLoading?: boolean;
   fullWidth?: boolean;
   icon?: Component;
   type?: 'button' | 'submit' | 'reset';
   disabled?: boolean;
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
   variant: 'primary',
   size: 'md',
   isLoading: false,
   fullWidth: false,
   icon: undefined,
   type: 'button',
   disabled: false,
});

const rootAttrs: RootAttrs = useRootAttrs();

function getButtonClass(): string {
   return rootAttrs.mergeRootClass(buttonClasses(props.variant, props.size, props.fullWidth, undefined));
}
</script>

<template>
   <button v-bind="rootAttrs.getRestAttrs()" :type="type" :disabled="disabled || isLoading" :class="getButtonClass()">
      <LoaderCircle v-if="isLoading" class="size-4 animate-spin" aria-hidden="true" />
      <component :is="icon" v-else-if="icon" class="size-4" aria-hidden="true" />
      <slot />
   </button>
</template>
