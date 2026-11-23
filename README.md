# cinema-ecosystem-vue

Frontend Vue 3 cho Cinema Ecosystem. Dùng chung backend Spring Boot (`cinema-ecosystem-spring`) với frontend React (`cinema-ecosystem-frontend`).

## Công nghệ

- Vue 3 (`<script setup lang="ts">`), Vite, TypeScript
- Vue Router 5, Pinia (state phía client), TanStack Query cho Vue (state phía server)
- Tailwind CSS 4, axios, `clsx` + `tailwind-merge`

## Chạy

```bash
npm install
npm run dev
```

Dev server chạy ở `http://localhost:5173`, proxy `/api` tới `http://localhost:8080`. Trình duyệt luôn gọi cùng origin nên cookie HttpOnly SameSite=Strict hoạt động bình thường.

| Lệnh                 | Việc                         |
| -------------------- | ---------------------------- |
| `npm run dev`        | Chạy dev server              |
| `npm run type-check` | Kiểm tra kiểu bằng `vue-tsc` |
| `npm run lint`       | oxlint và ESLint             |
| `npm run format`     | Prettier cho `src/`          |
| `npm run build`      | Kiểm tra kiểu rồi build      |

Biến môi trường (xem `.env.example`): `VITE_API_BASE_URL`, mặc định `/api/v1`.

## Cấu trúc

```text
src/
├── api/                     axiosClient (401 silent refresh queue) dùng chung ở gốc;
│   └── <module>/            còn lại chia theo module backend: auth/, cinema/, movie/, showtime/, booking/, ...
├── assets/                  main.css (chỉ import Tailwind)
├── components/
│   ├── ui/                  BaseButton, BaseTextField, BaseAlert
│   ├── layout/              MainLayout, AuthLayout, StaffLayout, AdminLayout
│   ├── common/              FullPageSpinner, ForbiddenPage, ComingSoonPage
│   └── brand/               Logo (khi có)
├── features/                mỗi feature chia thư mục con theo vai trò của file
│   └── <feature>/
│       ├── pages/           trang gắn với route (XxxPage.vue)
│       ├── components/      component chỉ dùng trong feature
│       ├── guards/          navigation guard
│       ├── composables/     hàm useXxx của feature
│       ├── services/        logic phía client không có giao diện
│       └── utils/           hàm thuần (validation, định dạng, nhãn)
├── lib/<module>/            hàm và composable dùng chung nhiều feature: common/, auth/, cinema/, movie/, ...
├── plugins/                 cấu hình plugin Vue (vueQuery)
├── router/                  index.ts (tạo router, gắn guard), routes.ts (bảng route theo layout)
├── stores/                  Pinia: useAuthStore, về sau useBookingStore, ...
└── types/<module>/          interface mirror DTO backend: common/, auth/, cinema/, ...
```

Hiện có sẵn: `auth` (đăng nhập, khôi phục phiên, guard theo role), `home`. Các feature khác thêm vào `features/<tên>/` theo cùng khuôn.

## Quy ước

1. **Contract-first.** Viết DTO backend trước, rồi mirror sang `src/types/<module>/` đúng tên camelCase. Mọi endpoint trả `ApiResponse<T>` (`src/types/common/api.ts`).
2. **Phân vùng feature.** Feature không import vào thư mục nội bộ của feature khác. Mã dùng chung chuyển lên `src/lib/<module>`, `src/components`, `src/api`, `src/types`. Chỉ `src/router` và `src/components/layout` được ghép các feature lại. Không tạo thư mục rỗng.
3. **Import.** Trong cùng feature dùng đường dẫn tương đối giữa thư mục anh em (`../utils/redirect`). Mã ngoài feature dùng alias `@/`.
4. **Xác thực.** Access và refresh token chỉ nằm trong cookie HttpOnly. Store chỉ giữ `user`. `axiosClient` gửi `X-Requested-With` mặc định và tự refresh khi gặp 401.
5. **Phân quyền route.** Khai báo trong `meta` của route (`requiresAuth`, `guestOnly`, `roles`), kiểu ở `src/types/common/routeMeta.ts`. `authGuard` chờ khôi phục phiên rồi mới kiểm tra.
6. **Style TypeScript.** Hàm viết dạng `function`, mọi hàm và biến khai báo kiểu, không dùng `any`, đặt tên biến theo tên kiểu (`ChatMessage` thành `chatMessage`), mọi câu lệnh kết thúc bằng `;`. Không viết comment trong code. Định dạng do `.prettierrc.json` quy định.

## Thêm một route

1. Tạo trang ở `src/features/<feature>/pages/XxxPage.vue`.
2. Khai báo trong `src/router/routes.ts` dưới layout phù hợp, nạp lười bằng `() => import(...)`, thêm `meta` nếu cần đăng nhập hoặc giới hạn role.
