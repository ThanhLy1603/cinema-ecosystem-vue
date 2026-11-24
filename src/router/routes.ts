import { Film, Info, MessagesSquare, Popcorn, Tag, Ticket } from 'lucide-vue-next';
import { markRaw, type Component } from 'vue';
import type { RouteComponent, RouteMeta, RouteRecordRaw } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import type { UserRole } from '@/types/auth/auth';

const STAFF_ROLES: UserRole[] = ['ROLE_STAFF', 'ROLE_MANAGER', 'ROLE_ADMIN'];
const ADMIN_ROLES: UserRole[] = ['ROLE_ADMIN', 'ROLE_MANAGER'];
const ADMIN_ONLY_ROLES: UserRole[] = ['ROLE_ADMIN'];

function comingSoonRoute(
   path: string,
   name: string,
   title: string,
   description: string,
   icon: Component,
   meta?: RouteMeta,
): RouteRecordRaw {
   return {
      path,
      name,
      meta,
      component: () => import('@/components/common/ComingSoonPage.vue'),
      props: { title, description, icon: markRaw(icon) },
   };
}

function authPageRoute(
   path: string,
   name: string,
   loadPage: () => Promise<RouteComponent>,
   meta?: RouteMeta,
): RouteRecordRaw {
   return {
      path,
      meta,
      component: () => import('@/components/layout/AuthLayout.vue'),
      children: [{ path: '', name, component: loadPage }],
   };
}

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
         comingSoonRoute(
            'movies',
            'movies',
            'Phim',
            'Danh sách phim đang chiếu và sắp chiếu đang được xây dựng.',
            Film,
         ),
         comingSoonRoute('fnb', 'fnb', 'Thức ăn và nước', 'Thực đơn bắp nước và combo sẽ sớm có mặt.', Popcorn),
         comingSoonRoute(
            'promotions',
            'promotions',
            'Khuyến mãi',
            'Ưu đãi giảm giá và chương trình tích điểm thành viên sắp được cập nhật.',
            Tag,
         ),
         comingSoonRoute(
            'community',
            'community',
            'Cộng đồng & Blog',
            'Nơi chia sẻ đánh giá phim và bài viết điện ảnh đang được xây dựng.',
            MessagesSquare,
         ),
         comingSoonRoute('about', 'about', 'Giới thiệu', 'Trang giới thiệu về CinemaSphere sẽ sớm có mặt.', Info),
         {
            path: 'cinemas',
            name: 'cinemas',
            component: () => import('@/features/cinemas/pages/CinemaListPage.vue'),
         },
         {
            path: 'cinemas/:slug',
            name: 'cinema-detail',
            component: () => import('@/features/cinemas/pages/CinemaPublicPage.vue'),
         },
         comingSoonRoute('tickets', 'tickets', 'Vé của tôi', 'Lịch sử đặt vé và mã QR sẽ sớm có mặt.', Ticket, {
            requiresAuth: true,
         }),
         {
            path: 'profile',
            name: 'profile',
            meta: { requiresAuth: true },
            component: () => import('@/features/auth/pages/ProfilePage.vue'),
         },
         {
            path: 'forbidden',
            name: 'forbidden',
            component: () => import('@/components/common/ForbiddenPage.vue'),
         },
      ],
   },
   authPageRoute('/login', 'login', () => import('@/features/auth/pages/LoginPage.vue'), { guestOnly: true }),
   authPageRoute('/register', 'register', () => import('@/features/auth/pages/RegisterPage.vue'), { guestOnly: true }),
   authPageRoute('/forgot-password', 'forgot-password', () => import('@/features/auth/pages/ForgotPasswordPage.vue')),
   authPageRoute('/reset-password', 'reset-password', () => import('@/features/auth/pages/ResetPasswordPage.vue')),
   authPageRoute('/verify-email', 'verify-email', () => import('@/features/auth/pages/VerifyEmailPage.vue')),
   {
      path: '/staff',
      component: () => import('@/components/layout/StaffLayout.vue'),
      meta: { requiresAuth: true, roles: STAFF_ROLES },
      children: [
         comingSoonRoute(
            '',
            'staff-home',
            'Khu vực nhân viên',
            'Soát vé, giao bắp nước, bán vé tại quầy và ca làm việc sẽ được xây dựng tại đây.',
            Ticket,
         ),
      ],
   },
   {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, roles: ADMIN_ROLES },
      children: [
         comingSoonRoute(
            '',
            'admin-home',
            'Khu vực quản trị',
            'Quản lý phim, suất chiếu, giá, người dùng và báo cáo sẽ được xây dựng tại đây.',
            Info,
         ),
         {
            path: 'cinemas',
            name: 'admin-cinemas',
            component: () => import('@/features/cinema-management/pages/CinemaManagementPage.vue'),
         },
         {
            path: 'cinemas/new',
            name: 'admin-cinema-create',
            meta: { roles: ADMIN_ONLY_ROLES },
            component: () => import('@/features/cinema-management/pages/CinemaCreatePage.vue'),
         },
         {
            path: 'cinemas/facilities',
            name: 'admin-cinema-facilities',
            component: () => import('@/features/cinema-management/pages/FacilityManagementPage.vue'),
         },
         {
            path: 'cinemas/:cinemaId',
            name: 'admin-cinema-detail',
            component: () => import('@/features/cinema-management/pages/CinemaDetailPage.vue'),
         },
         {
            path: 'halls/:hallId/seat-map',
            name: 'admin-hall-seat-map',
            component: () => import('@/features/cinema-management/pages/SeatMapEditorPage.vue'),
         },
      ],
   },
   {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
   },
];
