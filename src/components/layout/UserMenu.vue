<script setup lang="ts">
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/vue-query';
import {
   ChevronDown,
   LayoutDashboard,
   LogOut,
   MonitorSmartphone,
   ScanLine,
   Store,
   Ticket,
   UserCog,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import { logout, logoutAll } from '@/api/auth/authApi';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { getPrimaryRoleLabel } from '@/lib/auth/roleLabels';
import { getErrorMessage } from '@/lib/common/apiError';
import { useOutsideClick } from '@/lib/common/useOutsideClick';
import { cn } from '@/lib/common/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types/auth/auth';

interface UserMenuProps {
   user: User;
}

const props = defineProps<UserMenuProps>();

const MENU_ITEM_CLASS: string =
   'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700';

const isOpen = ref<boolean>(false);
const signOutErrorMessage = ref<string | null>(null);
const containerElement = ref<HTMLElement | null>(null);
const queryClient: QueryClient = useQueryClient();
const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const authStore = useAuthStore();

function closeMenu(): void {
   isOpen.value = false;
}

function toggleMenu(): void {
   isOpen.value = !isOpen.value;
}

useOutsideClick(containerElement, closeMenu);

function finishSignOut(): void {
   authStore.logout();
   queryClient.clear();
   isOpen.value = false;
   void router.replace('/');
}

function handleSignOutError(error: unknown): void {
   signOutErrorMessage.value = getErrorMessage(error);
}

function clearSignOutError(): void {
   signOutErrorMessage.value = null;
}

const logoutMutation = useMutation<void, unknown, void>({
   mutationFn: logout,
   onMutate: clearSignOutError,
   onSuccess: finishSignOut,
   onError: handleSignOutError,
});
const logoutAllMutation = useMutation<void, unknown, void>({
   mutationFn: logoutAll,
   onMutate: clearSignOutError,
   onSuccess: finishSignOut,
   onError: handleSignOutError,
});

const isSigningOut = computed<boolean>(() => logoutMutation.isPending.value || logoutAllMutation.isPending.value);
const canAccessAdmin = computed<boolean>(
   () => props.user.roles.includes('ROLE_ADMIN') || props.user.roles.includes('ROLE_MANAGER'),
);
const canAccessStaff = computed<boolean>(() => canAccessAdmin.value || props.user.roles.includes('ROLE_STAFF'));
const isInAdminRoute = computed<boolean>(() => route.path.startsWith('/admin'));
const isInStaffRoute = computed<boolean>(() => route.path.startsWith('/staff'));
</script>

<template>
   <div ref="containerElement" class="relative">
      <button
         type="button"
         aria-haspopup="menu"
         :aria-expanded="isOpen"
         class="flex items-center gap-2.5 rounded-xl border border-white bg-white py-1 pl-1 pr-1.5 shadow-sm transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 sm:pr-3"
         @click="toggleMenu"
      >
         <UserAvatar :full-name="user.fullName" :avatar-url="user.avatarUrl" class="size-7" />
         <span class="hidden max-w-[140px] truncate text-sm font-semibold text-ink-800 sm:block xl:hidden 2xl:block">
            {{ user.fullName }}
         </span>
         <ChevronDown
            :class="cn('size-4 text-ink-400 transition-transform duration-200', isOpen && 'rotate-180')"
            aria-hidden="true"
         />
      </button>

      <div
         v-if="isOpen"
         role="menu"
         class="absolute right-0 z-50 mt-2 w-72 origin-top-right animate-fade-up overflow-hidden rounded-lg border border-ink-200 bg-white shadow-soft"
      >
         <div class="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-4 py-3.5">
            <UserAvatar :full-name="user.fullName" :avatar-url="user.avatarUrl" class="size-12" />
            <div class="min-w-0">
               <p class="truncate text-sm font-bold text-ink-900">{{ user.fullName }}</p>
               <p class="truncate text-xs text-ink-500">{{ user.email }}</p>
               <span
                  class="mt-1.5 inline-flex rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-200"
               >
                  {{ getPrimaryRoleLabel(user) }}
                  <template v-if="user.tier"> · {{ user.tier }}</template>
               </span>
            </div>
         </div>

         <div class="p-2">
            <RouterLink to="/profile" role="menuitem" :class="MENU_ITEM_CLASS" @click="closeMenu">
               <UserCog class="size-[18px]" aria-hidden="true" />
               Hồ sơ của tôi
            </RouterLink>
            <RouterLink to="/tickets" role="menuitem" :class="MENU_ITEM_CLASS" @click="closeMenu">
               <Ticket class="size-[18px]" aria-hidden="true" />
               Vé của tôi
            </RouterLink>
            <RouterLink
               v-if="canAccessAdmin"
               :to="isInAdminRoute ? '/' : '/admin'"
               role="menuitem"
               :class="MENU_ITEM_CLASS"
               @click="closeMenu"
            >
               <Store v-if="isInAdminRoute" class="size-[18px]" aria-hidden="true" />
               <LayoutDashboard v-else class="size-[18px]" aria-hidden="true" />
               {{ isInAdminRoute ? 'Trang khách hàng' : 'Trang quản trị' }}
            </RouterLink>
            <RouterLink
               v-if="canAccessStaff"
               :to="isInStaffRoute ? '/' : '/staff'"
               role="menuitem"
               :class="MENU_ITEM_CLASS"
               @click="closeMenu"
            >
               <Store v-if="isInStaffRoute" class="size-[18px]" aria-hidden="true" />
               <ScanLine v-else class="size-[18px]" aria-hidden="true" />
               {{ isInStaffRoute ? 'Trang khách hàng' : 'Trang nhân viên' }}
            </RouterLink>
            <button
               type="button"
               role="menuitem"
               :disabled="isSigningOut"
               :class="cn(MENU_ITEM_CLASS, 'w-full text-left disabled:opacity-60')"
               @click="logoutAllMutation.mutate()"
            >
               <MonitorSmartphone class="size-[18px]" aria-hidden="true" />
               Đăng xuất mọi thiết bị
            </button>
            <button
               type="button"
               role="menuitem"
               :disabled="isSigningOut"
               class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-60"
               @click="logoutMutation.mutate()"
            >
               <LogOut class="size-[18px]" aria-hidden="true" />
               {{ logoutMutation.isPending.value ? 'Đang đăng xuất...' : 'Đăng xuất' }}
            </button>
            <p v-if="signOutErrorMessage" role="alert" class="px-3 pb-1 pt-2 text-[13px] font-medium text-danger-700">
               {{ signOutErrorMessage }}
            </p>
         </div>
      </div>
   </div>
</template>
