<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { Crown, Link2, Star } from 'lucide-vue-next';
import { getMyProfile } from '@/api/auth/userApi';
import FullPageSpinner from '@/components/common/FullPageSpinner.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import { getErrorMessage } from '@/lib/common/apiError';
import type { MembershipTier } from '@/types/auth/auth';
import type { UserProfile } from '@/types/auth/profile';
import BranchAssignmentList from '../components/BranchAssignmentList.vue';
import ChangePasswordForm from '../components/ChangePasswordForm.vue';
import EmailVerificationNotice from '../components/EmailVerificationNotice.vue';
import ProfileForm from '../components/ProfileForm.vue';
import { PROFILE_QUERY_KEY } from '../utils/queryKeys';

const TIER_LABELS: Record<MembershipTier, string> = {
   STAR: 'Star',
   GOLD: 'Gold',
   DIAMOND: 'Diamond',
};

const {
   data: userProfile,
   isPending,
   isError,
   error,
   refetch,
} = useQuery<UserProfile>({
   queryKey: PROFILE_QUERY_KEY,
   queryFn: getMyProfile,
});

function formatLinkedProviders(profile: UserProfile): string {
   return profile.linkedProviders.length === 0 ? 'Chưa liên kết' : profile.linkedProviders.join(', ');
}

function retry(): void {
   void refetch();
}
</script>

<template>
   <FullPageSpinner v-if="isPending" />

   <div v-else-if="isError" class="mx-auto w-full max-w-2xl space-y-4 px-4 py-16 sm:px-6">
      <BaseAlert variant="error">{{ getErrorMessage(error) }}</BaseAlert>
      <BaseButton variant="secondary" @click="retry">Thử lại</BaseButton>
   </div>

   <div v-else-if="userProfile" class="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header class="flex flex-wrap items-center gap-5 rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100">
         <UserAvatar :full-name="userProfile.fullName" :avatar-url="userProfile.avatarUrl" class="size-20 text-xl" />
         <div class="min-w-0 flex-1">
            <h1 class="truncate text-2xl font-extrabold tracking-tight text-ink-900">{{ userProfile.fullName }}</h1>
            <p class="truncate text-sm text-ink-500">{{ userProfile.email }}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
               {{ getPrimaryRoleLabel(userProfile) }}
            </p>
         </div>
         <dl class="flex gap-6 text-sm">
            <div>
               <dt class="flex items-center gap-1.5 text-ink-500">
                  <Crown class="size-4" aria-hidden="true" />
                  Hạng thành viên
               </dt>
               <dd class="mt-0.5 font-bold text-ink-900">{{ TIER_LABELS[userProfile.tier] }}</dd>
            </div>
            <div>
               <dt class="flex items-center gap-1.5 text-ink-500">
                  <Star class="size-4" aria-hidden="true" />
                  Điểm tích lũy
               </dt>
               <dd class="mt-0.5 font-bold text-ink-900">{{ userProfile.loyaltyPoints.toLocaleString('vi-VN') }}</dd>
            </div>
            <div>
               <dt class="flex items-center gap-1.5 text-ink-500">
                  <Link2 class="size-4" aria-hidden="true" />
                  Liên kết
               </dt>
               <dd class="mt-0.5 font-bold text-ink-900">{{ formatLinkedProviders(userProfile) }}</dd>
            </div>
         </dl>
      </header>

      <EmailVerificationNotice v-if="!userProfile.emailVerified" />

      <section
         v-if="userProfile.branches.length > 0"
         class="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8"
      >
         <h2 class="mb-6 text-xl font-bold text-ink-900">Chi nhánh làm việc</h2>
         <BranchAssignmentList :branch-assignments="userProfile.branches" />
      </section>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
         <section class="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
            <h2 class="mb-6 text-xl font-bold text-ink-900">Thông tin cá nhân</h2>
            <ProfileForm :key="userProfile.id" :user-profile="userProfile" />
         </section>
         <section class="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
            <h2 class="mb-6 text-xl font-bold text-ink-900">
               {{ userProfile.hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu' }}
            </h2>
            <ChangePasswordForm :has-password="userProfile.hasPassword" />
         </section>
      </div>
   </div>
</template>
