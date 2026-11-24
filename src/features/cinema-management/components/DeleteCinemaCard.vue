<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteCinema } from '@/api/cinema/cinemaApi';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { getErrorMessage } from '@/lib/common/apiError';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';

interface DeleteCinemaCardProps {
   cinemaId: number;
}

const props = defineProps<DeleteCinemaCardProps>();

const router = useRouter();
const refreshCinema: () => void = useCinemaRefresh(null);
const isConfirming = ref<boolean>(false);

function handleDeleted(): void {
   refreshCinema();
   void router.replace('/admin/cinemas');
}

const {
   mutate: submitDelete,
   isPending,
   isError,
   error,
} = useMutation<void, unknown, void>({
   mutationFn: () => deleteCinema(props.cinemaId),
   onSuccess: handleDeleted,
});

function startConfirming(): void {
   isConfirming.value = true;
}

function cancelConfirming(): void {
   isConfirming.value = false;
}

function confirmDelete(): void {
   submitDelete();
}
</script>

<template>
   <div class="space-y-5">
      <BaseAlert v-if="isError" variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <p class="text-sm text-ink-600">
         Cụm rạp bị xóa mềm: ẩn khỏi danh sách và trang khách hàng nhưng dữ liệu vẫn được giữ lại, có thể khôi phục
         trong bộ lọc «Đã xóa». Không thể xóa khi còn suất chiếu chưa diễn ra.
      </p>
      <BaseButton v-if="!isConfirming" variant="secondary" :icon="Trash2" @click="startConfirming">
         Xóa cụm rạp
      </BaseButton>
      <div v-else class="flex flex-wrap gap-3">
         <BaseButton :is-loading="isPending" @click="confirmDelete">Xác nhận xóa</BaseButton>
         <BaseButton variant="ghost" @click="cancelConfirming">Hủy</BaseButton>
      </div>
   </div>
</template>
