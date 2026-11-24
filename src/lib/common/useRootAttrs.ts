import type { ClassValue } from 'clsx';
import { useAttrs } from 'vue';
import { cn } from '@/lib/common/utils';

export interface RootAttrs {
   mergeRootClass: (baseClass: string) => string;
   getRestAttrs: () => Record<string, unknown>;
}

export function useRootAttrs(): RootAttrs {
   const attrs: Record<string, unknown> = useAttrs();

   function mergeRootClass(baseClass: string): string {
      return cn(baseClass, attrs.class as ClassValue);
   }

   function getRestAttrs(): Record<string, unknown> {
      return Object.fromEntries(Object.entries(attrs).filter(([attributeName]) => attributeName !== 'class'));
   }

   return { mergeRootClass, getRestAttrs };
}
