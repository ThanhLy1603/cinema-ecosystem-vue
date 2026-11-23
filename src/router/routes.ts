import type { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import type { UserRole } from '@/types/auth/auth';

const STAFF_ROLES: UserRole[] = ['ROLE_STAFF', 'ROLE_MANAGER', 'ROLE_ADMIN'];
const ADMIN_ROLES: UserRole[] = ['ROLE_ADMIN', 'ROLE_MANAGER'];

export const routes: RouteRecordRaw[] = [
   {
      path: '/',
      component: MainLayout,
      children: [
         {
            path: '',
            name: 'home',
            component: () => import('@/features/home/pages/HomePage.vue'),
         },
         {
            path: 'forbidden',
            name: 'forbidden',
            component: () => import('@/components/common/ForbiddenPage.vue'),
         },
      ],
   },
   {
      path: '/login',
      component: () => import('@/components/layout/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
         {
            path: '',
            name: 'login',
            component: () => import('@/features/auth/pages/LoginPage.vue'),
         },
      ],
   },
   {
      path: '/staff',
      component: () => import('@/components/layout/StaffLayout.vue'),
      meta: { requiresAuth: true, roles: STAFF_ROLES },
      children: [
         {
            path: '',
            name: 'staff-home',
            component: () => import('@/components/common/ComingSoonPage.vue'),
            props: {
               title: 'Khu vực nhân viên',
               description: 'Soát vé, giao bắp nước, bán vé tại quầy và ca làm việc sẽ được xây dựng tại đây.',
               backLabel: 'Về trang chủ',
            },
         },
      ],
   },
   {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, roles: ADMIN_ROLES },
      children: [
         {
            path: '',
            name: 'admin-home',
            component: () => import('@/components/common/ComingSoonPage.vue'),
            props: {
               title: 'Khu vực quản trị',
               description: 'Quản lý rạp, phim, suất chiếu, giá, người dùng và báo cáo sẽ được xây dựng tại đây.',
               backLabel: 'Về trang chủ',
            },
         },
      ],
   },
   {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
   },
];
