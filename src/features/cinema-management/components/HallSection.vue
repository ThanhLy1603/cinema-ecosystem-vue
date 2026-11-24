<script setup lang="ts">
import { History, Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { Hall } from '@/types/cinema/cinema';
import DeletedHallList from './DeletedHallList.vue';
import HallForm from './HallForm.vue';
import HallRow from './HallRow.vue';

interface HallSectionProps {
   cinemaId: number;
   halls: Hall[];
}

defineProps<HallSectionProps>();

const editingHallId = ref<number | null>(null);
const isCreating = ref<boolean>(false);
const isShowingDeleted = ref<boolean>(false);

function closeForms(): void {
   editingHallId.value = null;
   isCreating.value = false;
}

function startEditing(hallId: number): void {
   isCreating.value = false;
   editingHallId.value = hallId;
}

function startCreating(): void {
   editingHallId.value = null;
   isCreating.value = true;
}

function toggleDeletedHalls(): void {
   isShowingDeleted.value = !isShowingDeleted.value;
}
</script>

<template>
   <div class="space-y-4">
      <p
         v-if="halls.length === 0 && !isCreating"
         class="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500"
      >
         Cụm rạp này chưa có phòng chiếu nào.
      </p>
      <ul class="space-y-3">
         <template v-for="hall in halls" :key="hall.id">
            <li v-if="editingHallId === hall.id">
               <HallForm :cinema-id="cinemaId" :hall="hall" @done="closeForms" @cancel="closeForms" />
            </li>
            <HallRow v-else :hall="hall" @edit="startEditing" />
         </template>
      </ul>
      <HallForm v-if="isCreating" :cinema-id="cinemaId" @done="closeForms" @cancel="closeForms" />
      <BaseButton v-else variant="secondary" :icon="Plus" @click="startCreating">Thêm phòng chiếu</BaseButton>
      <div class="space-y-3 border-t border-ink-100 pt-4">
         <BaseButton variant="ghost" :icon="History" @click="toggleDeletedHalls">
            {{ isShowingDeleted ? 'Ẩn phòng đã xóa' : 'Xem phòng đã xóa' }}
         </BaseButton>
         <DeletedHallList v-if="isShowingDeleted" :cinema-id="cinemaId" />
      </div>
   </div>
</template>
