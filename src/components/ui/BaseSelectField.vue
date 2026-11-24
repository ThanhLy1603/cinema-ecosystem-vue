<script setup lang="ts">
import { Check, ChevronDown, CircleAlert, Search, X } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { normalizeSearchText } from '@/lib/common/searchText';
import { useOutsideClick } from '@/lib/common/useOutsideClick';
import { cn } from '@/lib/common/utils';
import type { SelectOption } from '@/types/common/selectOption';

interface BaseSelectFieldProps {
   id: string;
   label: string;
   options: SelectOption[];
   error?: string;
   disabled?: boolean;
   optional?: boolean;
   placeholder?: string;
   hideLabel?: boolean;
   triggerClassName?: string;
   menuClassName?: string;
}

const props = withDefaults(defineProps<BaseSelectFieldProps>(), {
   error: undefined,
   disabled: false,
   optional: false,
   placeholder: 'Chọn...',
   hideLabel: false,
   triggerClassName: undefined,
   menuClassName: undefined,
});

const EMPTY_RESULT_MESSAGE: string = 'Không tìm thấy kết quả';

const modelValue = defineModel<string>({ required: true });
const isOpen = ref<boolean>(false);
const searchText = ref<string>('');
const activeIndex = ref<number>(0);
const containerElement = ref<HTMLElement | null>(null);
const triggerElement = ref<HTMLButtonElement | null>(null);
const searchInputElement = ref<HTMLInputElement | null>(null);

const messageId = computed<string>(() => `${props.id}-message`);
const listboxId = computed<string>(() => `${props.id}-listbox`);
const hasError = computed<boolean>(() => Boolean(props.error));
const selectedOption = computed<SelectOption | undefined>(() =>
   props.options.find((selectOption) => selectOption.value === modelValue.value),
);
const filteredOptions = computed<SelectOption[]>(() => {
   const normalizedSearchText: string = normalizeSearchText(searchText.value);
   return props.options.filter((selectOption) =>
      normalizeSearchText(selectOption.label).includes(normalizedSearchText),
   );
});
const canClear = computed<boolean>(() => !props.disabled && modelValue.value !== '');
const activeOptionId = computed<string | undefined>(() =>
   isOpen.value && filteredOptions.value.length > 0 ? `${props.id}-option-${activeIndex.value}` : undefined,
);
const triggerClass = computed<string>(() =>
   cn(
      'h-10 w-full rounded-lg border bg-white pl-3 text-left text-sm shadow-sm outline-none transition-colors disabled:bg-ink-50 disabled:text-ink-400',
      canClear.value ? 'pr-16' : 'pr-9',
      hasError.value
         ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-100'
         : 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
      selectedOption.value && modelValue.value !== '' ? 'text-ink-900' : 'text-ink-400',
      props.triggerClassName,
   ),
);
const menuClass = computed<string>(() =>
   cn(
      'absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft',
      props.menuClassName,
   ),
);

function closeDropdown(): void {
   isOpen.value = false;
}

useOutsideClick(containerElement, closeDropdown);

function openDropdown(): void {
   if (props.disabled) {
      return;
   }
   searchText.value = '';
   const selectedIndex: number = props.options.findIndex((selectOption) => selectOption.value === modelValue.value);
   activeIndex.value = Math.max(selectedIndex, 0);
   isOpen.value = true;
}

function toggleDropdown(): void {
   if (isOpen.value) {
      closeDropdown();
      return;
   }
   openDropdown();
}

function selectOption(nextValue: string): void {
   modelValue.value = nextValue;
   closeDropdown();
   triggerElement.value?.focus();
}

function clearSelection(): void {
   modelValue.value = '';
   closeDropdown();
   triggerElement.value?.focus();
}

function handleSearchInput(): void {
   activeIndex.value = 0;
}

function handleTriggerKeyDown(keyboardEvent: KeyboardEvent): void {
   if (keyboardEvent.key === 'ArrowDown' || keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      openDropdown();
   }
}

function handleSearchKeyDown(keyboardEvent: KeyboardEvent): void {
   if (keyboardEvent.key === 'ArrowDown') {
      keyboardEvent.preventDefault();
      activeIndex.value = Math.min(activeIndex.value + 1, Math.max(filteredOptions.value.length - 1, 0));
   } else if (keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      activeIndex.value = Math.max(activeIndex.value - 1, 0);
   } else if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      const activeOption: SelectOption | undefined = filteredOptions.value[activeIndex.value];
      if (activeOption) {
         selectOption(activeOption.value);
      }
   } else if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      closeDropdown();
      triggerElement.value?.focus();
   } else if (keyboardEvent.key === 'Tab') {
      closeDropdown();
   }
}

watch(isOpen, async (isDropdownOpen: boolean): Promise<void> => {
   if (isDropdownOpen) {
      await nextTick();
      searchInputElement.value?.focus();
   }
});

watch(activeOptionId, async (optionId: string | undefined): Promise<void> => {
   if (optionId) {
      await nextTick();
      document.getElementById(optionId)?.scrollIntoView?.({ block: 'nearest' });
   }
});
</script>

<template>
   <div ref="containerElement" class="space-y-1">
      <label
         :for="id"
         :class="
            cn('flex items-baseline justify-between text-[13px] font-semibold text-ink-700', hideLabel && 'sr-only')
         "
      >
         <span>{{ label }}</span>
         <span v-if="optional" class="text-xs font-normal text-ink-400">Không bắt buộc</span>
      </label>

      <div class="relative">
         <button
            :id="id"
            ref="triggerElement"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
            :aria-controls="listboxId"
            :aria-invalid="hasError"
            :aria-describedby="error ? messageId : undefined"
            :disabled="disabled"
            :class="triggerClass"
            @click="toggleDropdown"
            @keydown="handleTriggerKeyDown"
         >
            <span class="block truncate">{{ selectedOption ? selectedOption.label : placeholder }}</span>
         </button>
         <button
            v-if="canClear"
            type="button"
            aria-label="Xóa lựa chọn"
            class="absolute right-8 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            @click="clearSelection"
         >
            <X class="size-4" aria-hidden="true" />
         </button>
         <ChevronDown
            :class="
               cn(
                  'pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-400 transition-transform duration-200',
                  isOpen && 'rotate-180',
               )
            "
            aria-hidden="true"
         />

         <div v-if="isOpen" :class="menuClass">
            <div class="relative border-b border-ink-100 p-2">
               <Search
                  class="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
               />
               <input
                  ref="searchInputElement"
                  v-model="searchText"
                  type="text"
                  placeholder="Tìm kiếm..."
                  aria-label="Tìm trong danh sách"
                  :aria-controls="listboxId"
                  :aria-activedescendant="activeOptionId"
                  autocomplete="off"
                  class="h-10 w-full rounded-lg border border-ink-200 pl-9 pr-3 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  @input="handleSearchInput"
                  @keydown="handleSearchKeyDown"
               />
            </div>
            <ul :id="listboxId" role="listbox" :aria-label="label" class="max-h-60 overflow-y-auto py-1">
               <li v-if="filteredOptions.length === 0" role="presentation" class="px-4 py-3 text-sm text-ink-500">
                  {{ EMPTY_RESULT_MESSAGE }}
               </li>
               <li
                  v-for="(filteredOption, optionIndex) in filteredOptions"
                  :id="`${id}-option-${optionIndex}`"
                  :key="filteredOption.value"
                  role="option"
                  :aria-selected="filteredOption.value === modelValue"
                  :class="
                     cn(
                        'flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm',
                        optionIndex === activeIndex ? 'bg-brand-50 text-brand-700' : 'text-ink-800',
                        filteredOption.value === modelValue && 'font-semibold',
                     )
                  "
                  @mouseenter="activeIndex = optionIndex"
                  @click="selectOption(filteredOption.value)"
               >
                  <span class="truncate">{{ filteredOption.label }}</span>
                  <Check
                     v-if="filteredOption.value === modelValue"
                     class="size-4 shrink-0 text-brand-600"
                     aria-hidden="true"
                  />
               </li>
            </ul>
         </div>
      </div>

      <p
         v-if="error"
         :id="messageId"
         role="alert"
         class="flex items-center gap-1.5 text-[13px] font-medium text-danger-700"
      >
         <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
         {{ error }}
      </p>
   </div>
</template>
