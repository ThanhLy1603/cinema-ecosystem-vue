<script setup lang="ts">
import { ArrowLeft, Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import SectionCard from '@/components/common/SectionCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import FacilityForm from '../components/FacilityForm.vue';
import FacilityRow from '../components/FacilityRow.vue';
import { useFacilities } from '../hooks/useFacilities';
import { DELETED_FILTER_OPTIONS } from '../utils/labels';

const authStore = useAuthStore();
const isAdmin = computed<boolean>(() => authStore.hasRole('ROLE_ADMIN'));
const deletedFilter = ref<string>('');
const isShowingDeleted = computed<boolean>(() => deletedFilter.value === 'true');
const editingFacilityId = ref<number | null>(null);
const isCreating = ref<boolean>(false);

const { data: facilities, isPending, isError, error } = useFacilities(isShowingDeleted);

const sectionDescription = computed<string>(() =>
   isAdmin.value
      ? 'Bãi đỗ xe, phòng VIP, khu vui chơi... Gán tiện ích cho từng cụm rạp ở trang chi tiết.'
      : 'Chỉ quản trị viên mới được thêm, sửa hoặc xóa tiện ích.',
);

function closeForms(): void {
   editingFacilityId.value = null;
   isCreating.value = false;
}

function startEditing(facilityId: number): void {
   isCreating.value = false;
   editingFacilityId.value = facilityId;
}

function startCreating(): void {
   editingFacilityId.value = null;
   isCreating.value = true;
}
</script>

<template>
   <div class="w-full max-w-3xl space-y-6">
      <RouterLink to="/admin/cinemas" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
         <ArrowLeft class="size-4" aria-hidden="true" />
         Về danh sách cụm rạp
      </RouterLink>
      <h1 class="text-xl font-semibold tracking-tight text-ink-900">Danh mục tiện ích</h1>
      <SectionCard title="Tiện ích của rạp" :description="sectionDescription">
         <div class="space-y-4">
            <div v-if="isAdmin" class="max-w-xs">
               <BaseSelectField
                  id="facility-deleted-filter"
                  v-model="deletedFilter"
                  label="Hiển thị"
                  :options="DELETED_FILTER_OPTIONS"
                  placeholder="Đang sử dụng"
               />
            </div>
            <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
            <p v-if="isPending" class="text-sm text-ink-500">Đang tải danh mục...</p>
            <ul class="space-y-3">
               <template v-for="facility in facilities" :key="facility.id">
                  <li v-if="editingFacilityId === facility.id">
                     <FacilityForm :facility="facility" @done="closeForms" @cancel="closeForms" />
                  </li>
                  <FacilityRow v-else :facility="facility" :can-manage="isAdmin" @edit="startEditing" />
               </template>
            </ul>
            <p
               v-if="facilities && facilities.length === 0"
               class="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500"
            >
               Danh mục tiện ích đang trống.
            </p>
            <template v-if="isAdmin && !isShowingDeleted">
               <FacilityForm v-if="isCreating" @done="closeForms" @cancel="closeForms" />
               <BaseButton v-else variant="secondary" :icon="Plus" @click="startCreating">Thêm tiện ích</BaseButton>
            </template>
         </div>
      </SectionCard>
   </div>
</template>
