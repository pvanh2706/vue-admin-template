# Hướng dẫn Dev Mới — Vue Admin Template

> Tài liệu này giúp bạn hiểu cấu trúc dự án, các pattern được dùng, và biết đặt code đúng chỗ ngay từ ngày đầu.

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cài đặt & Chạy dự án](#2-cài-đặt--chạy-dự-án)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Luồng khởi động ứng dụng](#4-luồng-khởi-động-ứng-dụng)
5. [Hệ thống Layout](#5-hệ-thống-layout)
6. [Routing — Thêm trang mới](#6-routing--thêm-trang-mới)
7. [Gọi API — Pattern chuẩn](#7-gọi-api--pattern-chuẩn)
8. [State Management](#8-state-management)
9. [Components — Phân loại & Cách dùng](#9-components--phân-loại--cách-dùng)
10. [Theme & Dark Mode](#10-theme--dark-mode)
11. [Sidebar & Navigation](#11-sidebar--navigation)
12. [TypeScript Types — Đặt ở đâu?](#12-typescript-types--đặt-ở-đâu)
13. [Icons — Dùng thế nào?](#13-icons--dùng-thế-nào)
14. [Quy tắc đặt tên](#14-quy-tắc-đặt-tên)
15. [Checklist khi tạo tính năng mới](#15-checklist-khi-tạo-tính-năng-mới)
16. [Các lỗi phổ biến cần tránh](#16-các-lỗi-phổ-biến-cần-tránh)

---

## 1. Tổng quan dự án

Đây là một **Admin Dashboard** xây dựng trên Vue 3, được dùng làm nền tảng cho ứng dụng POS (Point of Sale) — CodeOn POS. Dự án kết hợp hai UI system:

- **Tailwind CSS 4** — layout, spacing, responsive
- **Element Plus 2** — form controls, table, dialog, notification

Design Figma: https://www.figma.com/design/Ng19EfuzQJeMKx8m5FEl12/POS_-CodeOn-Pos

### Stack chính

| Mục đích | Thư viện |
|----------|----------|
| Framework | Vue 3.5 + Composition API (`<script setup>`) |
| Routing | Vue Router 4.5 |
| State | Pinia 3.0 |
| UI chính | Tailwind CSS 4.0 + Element Plus 2.13 |
| HTTP | Axios 1.13 |
| Build | Vite 6 + TypeScript 5.7 |
| Charts | ApexCharts 4.4 |
| Linting | ESLint 9 + Prettier 3.4 |

---

## 2. Cài đặt & Chạy dự án

```bash
# Cài dependencies
npm install

# Chạy dev server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Kiểm tra TypeScript
npm run type-check

# Lint & format
npm run lint
npm run format
```

### Biến môi trường

Tạo file `.env.local` ở thư mục gốc (không commit file này):

```env
VITE_API_BASE_URL=https://your-api-url.com
```

File `.env.local` được Vite đọc tự động và không bị ghi đè bởi `.env`.

---

## 3. Cấu trúc thư mục

```
src/
├── assets/                  # CSS toàn cục
│   ├── main.css             # Entry CSS, import Tailwind
│   ├── element-plus-dark.css # Override dark mode cho Element Plus
│
├── components/              # Tất cả component tái sử dụng
│   ├── charts/              # ApexCharts wrappers
│   ├── common/              # Component tiện ích nhỏ (Breadcrumb, Countdown...)
│   ├── ecommerce/           # Component riêng cho trang Dashboard
│   ├── forms/               # Input components phức tạp
│   ├── jira/                # Component UI cho tính năng Jira
│   ├── layout/              # AdminLayout, AppSidebar, AppHeader, Providers
│   ├── products/            # Component riêng cho trang Products
│   ├── profile/             # Component riêng cho trang Profile
│   ├── tables/              # Table components
│   └── ui/
│       ├── element-plus/    # Wrapper layer cho Element Plus (App*)
│       ├── images/          # Image display components
│       ├── Alert.vue        # Base Alert (Tailwind-based)
│       ├── Avatar.vue
│       ├── Badge.vue
│       └── Button.vue       # Base Button (Tailwind-based)
│
├── composables/             # Vue Composition API hooks
│   ├── useSidebar.ts        # Sidebar state & context
│   └── jira/
│       ├── useJiraConfigState.ts  # Shared Jira state
│       ├── useJiraConnection.ts   # Jira API operations
│       └── useJiraProjects.ts     # Jira projects data
│
├── icons/                   # SVG icon components (tự build)
│   └── index.ts             # Re-export tất cả icons
│
├── router/
│   └── index.ts             # Route definitions + beforeEach hook
│
├── services/                # API calls & business logic
│   ├── api/
│   │   └── axios.ts         # Axios instance + interceptors
│   ├── jira/                # Jira API service layer
│   └── user.ts
│
├── types/                   # TypeScript type definitions
│   ├── common.ts            # ApiResponse, isSuccess()
│   ├── user.ts              # User interface
│   └── jira/
│       └── config.ts        # Jira config types
│
├── utils/
│   └── api.ts               # apiCall() generic wrapper
│
├── views/                   # Page components (1 file = 1 route)
│   ├── Admin/               # Trang quản trị hệ thống
│   ├── Auth/                # Đăng nhập, đăng ký
│   ├── Chart/               # Trang demo chart
│   ├── Errors/              # Trang lỗi (404...)
│   ├── Forms/               # Trang demo form
│   ├── Others/              # Calendar, Profile
│   ├── Pages/               # Blank page template
│   ├── Product/             # Quản lý sản phẩm
│   ├── Tables/              # Trang demo table
│   ├── UiElements/          # Trang demo UI components
│   └── Ecommerce.vue        # Dashboard homepage
│
├── App.vue                  # Root component
└── main.ts                  # Khởi động app
```

---

## 4. Luồng khởi động ứng dụng

Hiểu thứ tự này sẽ giúp bạn debug các vấn đề khởi tạo.

### `main.ts` — Thứ tự import quan trọng

```
1. element-plus/dist/index.css          ← styles gốc của Element Plus
2. element-plus/theme-chalk/dark/...    ← CSS vars dark mode của Element Plus
3. ./assets/main.css                    ← Tailwind + custom styles (override EP)
4. ./assets/element-plus-dark.css       ← Override cuối cùng cho dark mode
5. swiper/css + jsvectormap/... + flatpickr/... ← Third-party CSS
```

> **Lý do quan trọng:** CSS được load theo thứ tự, file sau override file trước. `element-plus-dark.css` phải đứng sau `main.css` để các override dark mode có hiệu lực.

### Thứ tự đăng ký plugin

```typescript
app.use(router)          // ← hiện tại đăng ký trước Pinia (cần sửa)
app.use(VueApexCharts)
app.use(pinia)           // ← nên đưa lên trước router
app.mount('#app')
```

### `App.vue` — Provider pattern

```
<ThemeProvider>          ← inject theme context (isDarkMode, toggleTheme)
  <SidebarProvider>      ← inject sidebar context (isExpanded, toggle...)
    <RouterView />       ← render trang hiện tại
  </SidebarProvider>
</ThemeProvider>
```

Hai provider này bọc toàn bộ app. Mọi component con đều có thể dùng `useSidebar()` và `useTheme()` mà không cần truyền props.

---

## 5. Hệ thống Layout

### Mọi trang admin phải dùng `AdminLayout`

```vue
<!-- views/YourPage.vue — Pattern chuẩn -->
<template>
  <admin-layout>
    <page-breadcrumb page-title="Tên trang" />

    <!-- Nội dung trang -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      ...
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
</script>
```

### Cách `AdminLayout` hoạt động

```
AdminLayout
├── AppSidebar (fixed, left)
├── Backdrop (overlay khi mobile menu mở)
└── main content (flex-1, tự động shift khi sidebar expand/collapse)
    ├── AppHeader (sticky top)
    └── <slot> ← nội dung trang của bạn vào đây
```

Sidebar rộng `290px` khi mở, `90px` khi thu nhỏ. Main content tự động dịch qua phải dựa vào class `:class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"`.

### Trang không dùng admin layout (Auth pages)

Trang đăng nhập/đăng ký không wrap bằng `AdminLayout` — chúng dùng layout riêng hoặc không có layout. Xem [src/views/Auth/Signin.vue](../src/views/Auth/Signin.vue) làm ví dụ.

---

## 6. Routing — Thêm trang mới

### Bước 1: Tạo View component

```
src/views/YourFeature/YourPage.vue
```

### Bước 2: Đăng ký route trong `src/router/index.ts`

```typescript
{
  path: '/your-path',
  name: 'YourPageName',
  component: () => import('../views/YourFeature/YourPage.vue'),  // lazy load
  meta: {
    title: 'Tên hiển thị trên tab',
  },
},
```

**Quy tắc:**
- Luôn dùng dynamic `import()` — không import static ở đầu file
- `name` phải unique trong toàn bộ router
- `meta.title` hiện lên `document.title` qua `beforeEach` hook
- Route params dùng `:id` — ví dụ: `/store/:id/edit`

### Cấu trúc route hiện có

| Path | Name | View |
|------|------|------|
| `/` | Ecommerce | Dashboard homepage |
| `/calendar` | Calendar | Lịch |
| `/profile` | Profile | Trang cá nhân |
| `/signin` | Signin | Đăng nhập |
| `/signup` | Signup | Đăng ký |
| `/config-store` | ConfigStore | Quản lý cửa hàng |
| `/store-create` | StoreFormAdd | Thêm cửa hàng |
| `/store/:id/edit` | StoreFormEdit | Sửa cửa hàng |
| `/admin/jira-config` | JiraConfig | Cấu hình Jira |
| `/products` | Products | Quản lý sản phẩm |
| `/error-404` | 404 Error | Trang 404 |

---

## 7. Gọi API — Pattern chuẩn

Dự án dùng **Result Pattern** — mọi API call đều trả về `ApiResponse<T>`, không bao giờ throw exception lên tầng UI.

### Hiểu `ApiResponse<T>`

```typescript
// src/types/common.ts
type ApiResponse<T> =
  | { isSuccess: true; data: T }       // Thành công → có data
  | { isSuccess: false; error: string } // Thất bại → có error message
```

### Dùng `isSuccess()` type guard để narrow type

```typescript
import { isSuccess } from '@/types/common'

const result = await myApi.fetchSomething()

if (isSuccess(result)) {
  // TypeScript biết chắc result.data tồn tại
  console.log(result.data)
} else {
  // TypeScript biết chắc result.error là string
  console.error(result.error)
}
```

### Tạo service mới — Đặt ở đâu?

```
src/services/
└── yourFeature/
    ├── api.ts          ← các function gọi API
    ├── types.ts        ← types riêng của feature (hoặc để trong src/types/)
    └── index.ts        ← re-export
```

### Template tạo service

```typescript
// src/services/yourFeature/api.ts
import { apiCall } from '@/utils/api'
import type { YourType, CreateYourTypeRequest } from '@/types/yourFeature'

export const yourFeatureApi = {
  getAll() {
    return apiCall<YourType[]>('get', '/api/your-feature')
  },

  getById(id: string) {
    return apiCall<YourType>('get', `/api/your-feature/${id}`)
  },

  create(data: CreateYourTypeRequest) {
    return apiCall<YourType, CreateYourTypeRequest>('post', '/api/your-feature', data)
  },

  update(id: string, data: Partial<CreateYourTypeRequest>) {
    return apiCall<YourType>('put', `/api/your-feature/${id}`, data)
  },

  remove(id: string) {
    return apiCall<void>('delete', `/api/your-feature/${id}`)
  },
}
```

### Dùng trong component

```typescript
import { yourFeatureApi } from '@/services/yourFeature'
import { isSuccess } from '@/types/common'
import { ElNotification } from 'element-plus'

const loading = ref(false)
const items = ref<YourType[]>([])

async function fetchItems() {
  loading.value = true
  const result = await yourFeatureApi.getAll()
  loading.value = false

  if (isSuccess(result)) {
    items.value = result.data
  } else {
    ElNotification.error({ title: 'Lỗi', message: result.error })
  }
}
```

### `apiCall()` hoạt động thế nào?

```
GET/DELETE → data truyền vào params: { params: data }
POST/PUT   → data truyền vào body
Lỗi       → catch AxiosError, extract message từ nhiều format backend khác nhau
            → trả về { isSuccess: false, error: string }
```

---

## 8. State Management

### Khi nào dùng gì?

| Loại state | Giải pháp |
|-----------|-----------|
| State chỉ dùng trong 1 component | `ref()` / `reactive()` local |
| State chia sẻ giữa các component trong 1 feature | Composable với `provide/inject` |
| State toàn app (auth, user, settings) | Pinia store |
| State sidebar/theme | Đã có sẵn qua Provider pattern |

### Dùng Pinia Store

```typescript
// src/stores/yourStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useYourStore = defineStore('yourStore', () => {
  const items = ref<YourType[]>([])
  const loading = ref(false)

  const count = computed(() => items.value.length)

  function setItems(data: YourType[]) {
    items.value = data
  }

  return { items, loading, count, setItems }
})
```

Dùng trong component:
```typescript
import { useYourStore } from '@/stores/yourStore'

const store = useYourStore()
```

### Composable pattern (Jira example)

Dự án dùng composable với singleton state cho Jira:

```typescript
// Lấy state (reactive refs)
const { config, loading, error } = useJiraConfigState()

// Lấy operations (async functions)
const { fetchConfig, saveConfig, testConnection } = useJiraConnection()
```

---

## 9. Components — Phân loại & Cách dùng

### Có 3 loại component chính:

#### 9.1. Element Plus Wrappers (`src/components/ui/element-plus/`)

Đây là **layer trung gian** bọc Element Plus. Luôn ưu tiên dùng các component này thay vì dùng trực tiếp `<el-button>`, `<el-input>`, v.v.

| Component | Thay thế cho |
|-----------|-------------|
| `<AppButton>` | `<el-button>` |
| `<AppInput>` | `<el-input>` |
| `<AppSelect>` | `<el-select>` |
| `<AppDialog>` | `<el-dialog>` |
| `<AppDrawer>` | `<el-drawer>` |
| `<AppTable>` | `<el-table>` |
| `<AppForm>` / `<AppFormItem>` | `<el-form>` / `<el-form-item>` |
| `<AppCheckbox>` | `<el-checkbox>` |
| `<AppRadio>` | `<el-radio>` |
| `<AppSwitch>` | `<el-switch>` |
| `<AppPagination>` | `<el-pagination>` |
| `<AppTabs>` | `<el-tabs>` |
| `<AppTag>` | `<el-tag>` |

Ví dụ:
```vue
<!-- Đúng -->
<AppButton variant="primary" @click="save">Lưu</AppButton>
<AppInput v-model="name" placeholder="Nhập tên" />

<!-- Tránh dùng trực tiếp Element Plus trong views -->
<el-button type="primary" @click="save">Lưu</el-button>
```

Tất cả wrapper đều dùng `inheritAttrs: false` và `v-bind="$attrs"` — nên mọi prop/event của Element Plus gốc đều vẫn hoạt động.

#### 9.2. Base UI Components (`src/components/ui/`)

Component UI thuần Tailwind — không phụ thuộc Element Plus:

- `Button.vue` — button Tailwind-based (variant: `primary` | `outline`, size: `sm` | `md`)
- `Alert.vue` — alert message
- `Avatar.vue` — hiển thị avatar
- `Badge.vue` — badge/label nhỏ

#### 9.3. Common Utilities (`src/components/common/`)

- `PageBreadcrumb.vue` — breadcrumb + page title (dùng ở đầu mọi trang)
- `ThemeToggler.vue` — nút toggle dark/light
- `DropdownMenu.vue` — dropdown wrapper
- `CountDown.vue` — đếm ngược thời gian

### Tạo component mới — Đặt ở đâu?

```
Dùng ở nhiều trang khác nhau?
  → src/components/ui/          (nếu là base UI)
  → src/components/common/      (nếu là utility)

Chỉ dùng cho 1 feature/trang?
  → src/components/{feature}/   (ví dụ: src/components/products/)
  → hoặc đặt cùng thư mục với view

Wrap Element Plus?
  → src/components/ui/element-plus/
```

---

## 10. Theme & Dark Mode

### Cách hoạt động

1. `ThemeProvider` (trong `App.vue`) theo dõi theme và `provide` context
2. Theme được lưu vào `localStorage`
3. Khi dark mode: class `dark` được thêm vào `document.documentElement`
4. Tailwind + Element Plus đều đọc class `dark` này

### Dùng dark mode trong CSS

```vue
<!-- Tailwind dark: prefix -->
<div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">

<!-- Hoặc trong style scoped -->
<style scoped>
.my-element {
  @apply bg-white dark:bg-gray-900;
}
</style>
```

### Đọc theme state trong component

```typescript
import { useTheme } from '@/components/layout/ThemeProvider.vue'

const { isDarkMode, toggleTheme } = useTheme()
```

### Màu dark mode của Element Plus

Override CSS vars trong `src/assets/element-plus-dark.css`. Khi cần thêm override:

```css
/* src/assets/element-plus-dark.css */
.dark {
  --el-color-primary: #your-color;
  --el-bg-color: #your-bg;
}
```

---

## 11. Sidebar & Navigation

### Cách hoạt động

`SidebarProvider` (trong `App.vue`) gọi `useSidebarProvider()` — tạo context và `provide` xuống toàn cây component. Mọi component con dùng `useSidebar()` để lấy state.

```typescript
import { useSidebar } from '@/composables/useSidebar'

const {
  isExpanded,        // boolean — sidebar đang mở rộng không (desktop)
  isMobileOpen,      // boolean — sidebar đang hiện trên mobile không
  isHovered,         // boolean — đang hover vào sidebar thu nhỏ không
  openSubmenu,       // string | null — submenu nào đang mở
  toggleSidebar,     // () => void — toggle sidebar (desktop)
  toggleMobileSidebar, // () => void — toggle sidebar (mobile)
} = useSidebar()
```

> `useSidebar()` sẽ throw error nếu gọi bên ngoài cây con của `SidebarProvider`. Đây là thiết kế cố ý để tránh dùng sai.

### Thêm menu item vào Sidebar

Mở `src/components/layout/AppSidebar.vue`, tìm mảng `menuGroups` trong `<script setup>`:

```typescript
const menuGroups = [
  {
    title: 'MENU CHÍNH',
    items: [
      {
        name: 'Dashboard',
        icon: HomeIcon,
        path: '/',
      },
      {
        name: 'Sản phẩm',
        icon: BoxIcon,
        path: '/products',
      },
      // Thêm item mới vào đây
      {
        name: 'Tên menu',
        icon: YourIcon,       // import từ @/icons
        path: '/your-path',
      },
    ],
  },
  {
    title: 'NHÓM KHÁC',
    items: [
      // Menu có submenu
      {
        name: 'Cài đặt',
        icon: SettingsIcon,
        subItems: [
          { name: 'Cửa hàng', path: '/config-store' },
          { name: 'Tích hợp Jira', path: '/admin/jira-config' },
        ],
      },
    ],
  },
]
```

---

## 12. TypeScript Types — Đặt ở đâu?

### Quy tắc

```
Type dùng toàn app (User, ApiResponse...)
  → src/types/common.ts hoặc src/types/user.ts

Type riêng cho 1 feature
  → src/types/{feature}/       ví dụ: src/types/jira/config.ts
  → hoặc src/services/{feature}/types.ts (nếu chỉ service dùng)

Type chỉ dùng trong 1 component
  → Khai báo trực tiếp trong file đó
```

### `ApiResponse<T>` và `isSuccess()` — Luôn dùng cặp này

```typescript
import type { ApiResponse } from '@/types/common'
import { isSuccess } from '@/types/common'

// Khai báo return type của service function
function fetchUser(id: string): Promise<ApiResponse<User>> {
  return apiCall<User>('get', `/api/users/${id}`)
}

// Dùng trong component
const result = await fetchUser('123')
if (isSuccess(result)) {
  user.value = result.data  // TypeScript biết result.data là User
}
```

---

## 13. Icons — Dùng thế nào?

Dự án có 2 nguồn icon:

### 13.1. Custom SVG Icons (`src/icons/`)

Dùng cho icon trong sidebar menu và các chỗ đặc biệt:

```typescript
import { HomeIcon, SettingsIcon, BoxIcon } from '@/icons'
```

```vue
<template>
  <HomeIcon class="w-5 h-5" />
</template>
```

Danh sách đầy đủ: `BoxCubeIcon`, `GridIcon`, `CalenderIcon`, `TaskIcon`, `ChatIcon`, `MailIcon`, `DocsIcon`, `PieChartIcon`, `UserCircleIcon`, `ChevronDownIcon`, `HorizontalDots`, `PlugInIcon`, `PageIcon`, `SuccessIcon`, `ErrorIcon`, `InfoIcon`, `WarningIcon`, `PlusIcon`, `TrashIconLg`, `ListIcon`, `TableIcon`, `LogoutIcon`, `InfoCircleIcon`, `FolderIcon`, `SettingsIcon`, `HomeIcon`, `ChevronRightIcon`, `BoxIcon`, `ErrorHexaIcon`, `Calendar2Line`, `Message2Line`, `PaperclipIcon`, `MenuIcon`, `CheckIcon`, `MailBox`, `SendIcon`, `DraftIcon`, `TrashIcon`, `ArchiveIcon`, `FlagIcon`, `StaredIcon`, `RefreshIcon`, `SupportIcon`, `LayoutDashboardIcon`, `UserGroupIcon`, `BellIcon`, `BarChartIcon`

### 13.2. Lucide Icons (`lucide-vue-next`)

Đã cài sẵn, dùng cho icon trong nội dung trang:

```typescript
import { Search, Plus, Trash2, Edit, ChevronRight } from 'lucide-vue-next'
```

```vue
<Search class="w-4 h-4 text-gray-500" />
```

**Khi nào dùng cái nào?**
- Sidebar menu → Custom icons từ `@/icons`
- Nội dung trang, buttons, badges → Lucide icons

---

## 14. Quy tắc đặt tên

### Files

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Vue component | PascalCase | `UserProfile.vue`, `AppButton.vue` |
| Composable | camelCase, bắt đầu `use` | `useSidebar.ts`, `useJiraConnection.ts` |
| Service | camelCase | `axios.ts`, `config-api.ts` |
| Type file | camelCase | `common.ts`, `user.ts` |
| View (page) | PascalCase | `Signin.vue`, `ConfigStore.vue` |

### Variables & Functions

```typescript
// Component ref: camelCase
const isLoading = ref(false)
const userList = ref<User[]>([])

// Async functions: verb + noun
async function fetchUsers() { ... }
async function saveConfig() { ... }
async function deleteItem(id: string) { ... }

// Event handlers: handle + Event
function handleSubmit() { ... }
function handleClose() { ... }
function handleRowClick(row: User) { ... }

// Boolean: is/has/can prefix
const isExpanded = ref(true)
const hasConfig = computed(() => config.value !== null)
const canDelete = computed(() => userRole === 'Admin')
```

### CSS Classes (Tailwind)

Thứ tự viết class (convention):
```
layout → spacing → sizing → colors → typography → effects → responsive → dark:
```

Ví dụ:
```
"flex items-center gap-4 px-6 py-4 w-full bg-white text-gray-800 text-sm rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-900 dark:text-white"
```

---

## 15. Checklist khi tạo tính năng mới

Dùng checklist này mỗi khi thêm một feature/trang mới:

### Trang mới

- [ ] Tạo `src/views/{Feature}/{PageName}.vue`
- [ ] Wrap bằng `<admin-layout>` + thêm `<page-breadcrumb>`
- [ ] Đăng ký route trong `src/router/index.ts` (dùng dynamic import)
- [ ] Thêm menu item vào `AppSidebar.vue` nếu cần

### API mới

- [ ] Tạo `src/services/{feature}/api.ts` với các function dùng `apiCall()`
- [ ] Thêm types vào `src/types/{feature}/` hoặc ngay trong service
- [ ] Dùng `isSuccess()` khi xử lý response trong component

### Component mới

- [ ] Xác định loại: base UI / feature-specific / Element Plus wrapper
- [ ] Đặt vào đúng thư mục theo phân loại ở mục 9
- [ ] Dùng `defineProps<Interface>()` với TypeScript interface
- [ ] Không hardcode màu sắc — dùng Tailwind classes

### State mới

- [ ] State chỉ dùng local → `ref()` trong component
- [ ] State chia sẻ trong feature → composable
- [ ] State toàn app → Pinia store trong `src/stores/`

---

## 16. Các lỗi phổ biến cần tránh

### ❌ Import trực tiếp Element Plus trong views

```vue
<!-- Sai -->
<el-button type="primary">Lưu</el-button>

<!-- Đúng -->
<AppButton variant="primary">Lưu</AppButton>
```

### ❌ Gọi API trực tiếp trong component không qua service

```typescript
// Sai
const res = await axios.get('/api/users')

// Đúng
const res = await userApi.getAll()
if (isSuccess(res)) { ... }
```

### ❌ Throw/catch error trong component khi dùng Result pattern

```typescript
// Sai
try {
  const data = await userApi.getAll() // đã được wrap, không throw
  users.value = data // data có thể là ApiResponse, không phải array
} catch (e) { ... }

// Đúng
const result = await userApi.getAll()
if (isSuccess(result)) {
  users.value = result.data
}
```

### ❌ Gọi `useSidebar()` bên ngoài AdminLayout

```typescript
// Sẽ throw: "useSidebar must be used within a component that has SidebarProvider as an ancestor"
// Trang Auth không có SidebarProvider → không gọi useSidebar() ở đây
```

### ❌ Import CSS theo thứ tự sai trong `main.ts`

CSS override phải đặt sau. Không thay đổi thứ tự import trong `main.ts` nếu không hiểu rõ lý do.

### ❌ Dùng inline styles thay vì Tailwind

```vue
<!-- Sai -->
<div style="display: flex; align-items: center; gap: 16px">

<!-- Đúng -->
<div class="flex items-center gap-4">
```

### ❌ Tạo file backup trong VCS

```
Signin copy.vue   ← Xóa đi, dùng git history nếu cần xem lại
```

---

## Tham khảo thêm

- [Danh sách vấn đề cần cải thiện](./improvement-issues.md)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq)
- [Pinia docs](https://pinia.vuejs.org)
- [Element Plus docs](https://element-plus.org)
- [Tailwind CSS 4 docs](https://tailwindcss.com/docs)
- [Vue Router docs](https://router.vuejs.org)
