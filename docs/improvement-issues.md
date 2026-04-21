# Danh sách vấn đề cần cải thiện

> Cập nhật: 2026-04-21

---

## Mức độ ưu tiên

| Ký hiệu | Mức độ |
|---------|--------|
| 🔴 | Nghiêm trọng — ảnh hưởng bảo mật / runtime |
| 🟠 | Cao — ảnh hưởng chức năng chính |
| 🟡 | Trung bình — ảnh hưởng chất lượng code |
| 🟢 | Thấp — cải thiện DX / hiệu suất nhỏ |

---

## 1. Router & Navigation 🔴

### 1.1. Auth guards không được thực thi

**File:** [src/router/index.ts](../src/router/index.ts)

**Vấn đề:** `requiresAuth: true` và `requiresRole: 'Admin'` được đặt trong `meta` nhưng `beforeEach` hook chỉ cập nhật `document.title`, không kiểm tra xác thực nào cả. Người dùng chưa đăng nhập vẫn truy cập được mọi trang.

**Cách xử lý:**
```typescript
router.beforeEach((to, _from, next) => {
  document.title = `App - ${to.meta.title}`

  const token = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Signin' })
    return
  }

  if (to.meta.requiresRole) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== to.meta.requiresRole) {
      next({ name: 'NotFound' })
      return
    }
  }

  next()
})
```

---

### 1.2. Thiếu catch-all route cho trang 404

**File:** [src/router/index.ts](../src/router/index.ts)

**Vấn đề:** Không có wildcard route — người dùng gõ URL sai sẽ thấy trang trắng thay vì trang 404.

**Cách xử lý:** Thêm route này vào cuối mảng `routes`:
```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('../views/Errors/FourZeroFour.vue'),
  meta: { title: 'Không tìm thấy trang' },
}
```

---

## 2. Authentication 🔴

### 2.1. Luồng đăng nhập chưa hoàn chỉnh

**File:** [src/views/Auth/Signin.vue](../src/views/Auth/Signin.vue)

**Vấn đề:** `handleSubmit()` gọi `fetchUsers()` — một stub không thực sự xác thực. Không có code lưu JWT token, không redirect sau đăng nhập thành công.

**Cách xử lý:**
```typescript
const handleSubmit = async () => {
  try {
    const res = await authApi.signin({ email: email.value, password: password.value })
    if (isSuccess(res)) {
      localStorage.setItem('auth_token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = 'Email hoặc mật khẩu không đúng'
  }
}
```

---

### 2.2. File backup auth bị commit vào VCS

**Files:** `src/views/Auth/Signin copy.vue`, `src/views/Auth/Signup copy.vue`

**Vấn đề:** File sao lưu thủ công được commit vào repository, gây nhầm lẫn và tăng kích thước repo.

**Cách xử lý:** Xóa hai file này, dùng git history để xem lại lịch sử nếu cần.

---

## 3. Plugin Registration Order 🟠

### 3.1. Pinia được khởi tạo sau Router

**File:** [src/main.ts](../src/main.ts)

**Vấn đề:** `app.use(router)` được gọi trước `app.use(pinia)`. Nếu `router.beforeEach` cần truy cập Pinia store (ví dụ: lấy auth state), store sẽ chưa sẵn sàng và gây lỗi runtime.

**Cách xử lý:**
```typescript
const app = createApp(App)

// Pinia phải được đăng ký TRƯỚC router
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
```

---

## 4. API Layer 🟠

### 4.1. Hardcode baseURL, thiếu biến môi trường

**File:** [src/services/api/axios.ts](../src/services/api/axios.ts)

**Vấn đề:** `baseURL: 'https://api.example.com'` hardcode trực tiếp trong code. Không thể thay đổi URL giữa môi trường dev/staging/production mà không sửa code.

**Cách xử lý:**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
})
```

---

### 4.2. Không xử lý lỗi 401 / token hết hạn

**File:** [src/services/api/axios.ts](../src/services/api/axios.ts)

**Vấn đề:** Interceptor response chỉ log lỗi, không xử lý token hết hạn (HTTP 401). Người dùng sẽ bị lỗi im lặng thay vì được redirect về trang đăng nhập.

**Cách xử lý:**
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      router.push('/signin')
    }
    return Promise.reject(error)
  }
)
```

---

### 4.3. Xử lý lỗi trùng lặp ở hai tầng

**Files:** [src/services/api/axios.ts](../src/services/api/axios.ts) và [src/utils/api.ts](../src/utils/api.ts)

**Vấn đề:** `globalErrorHandler()` trong `axios.ts` log lỗi, rồi `apiCall()` trong `utils/api.ts` lại catch và transform lần nữa. Lỗi bị xử lý hai lần ở hai nơi khác nhau.

**Cách xử lý:** Chọn một trong hai pattern (interceptor hoặc wrapper function), xóa cái còn lại. Gợi ý giữ interceptor trong axios và bỏ `globalErrorHandler` riêng biệt.

---

## 5. Cấu hình môi trường 🟠

### 5.1. Thiếu file .env và type cho biến môi trường

**Vấn đề:** Không có file `.env.example` — developer mới không biết cần set biến nào. Vite proxy trong [vite.config.ts](../vite.config.ts) cũng hardcode URL.

**Cách xử lý:**

Tạo file `.env.example`:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Vue Admin
```

Bổ sung typing trong [env.d.ts](../env.d.ts):
```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Cập nhật [vite.config.ts](../vite.config.ts):
```typescript
proxy: {
  '/api': {
    target: process.env.VITE_API_BASE_URL,
    changeOrigin: true,
  },
},
```

---

## 6. State Management 🟡

### 6.1. Singleton reactive state trong composable

**File:** [src/composables/jira/useJiraConfigState.ts](../src/composables/jira/useJiraConfigState.ts)

**Vấn đề:** `const state = reactive({...})` được khai báo ở module-level, tạo singleton. Không tích hợp với Vue DevTools, không có time-travel debugging, khó viết test.

**Cách xử lý:** Chuyển sang Pinia store:
```typescript
// src/stores/jiraConfig.ts
export const useJiraConfigStore = defineStore('jiraConfig', () => {
  const config = ref<JiraConfig | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasConfig = computed(() => config.value !== null)

  return { config, loading, error, hasConfig }
})
```

---

## 7. Component Quality 🟡

### 7.1. Prop types không chính xác trong Button

**File:** [src/components/ui/Button.vue](../src/components/ui/Button.vue)

**Vấn đề:**
- `startIcon?: object` và `endIcon?: object` — kiểu `object` quá rộng, nên dùng `Component`
- `onClick?: () => void` — không nên dùng prop cho event handler, nên dùng `emit`

**Cách xử lý:**
```typescript
import type { Component } from 'vue'

interface ButtonProps {
  size?: 'sm' | 'md'
  variant?: 'primary' | 'outline'
  startIcon?: Component
  endIcon?: Component
  disabled?: boolean
}

const emit = defineEmits<{ click: [event: MouseEvent] }>()
```

---

### 7.2. AppSidebar quá lớn (302 dòng)

**File:** [src/components/layout/AppSidebar.vue](../src/components/layout/AppSidebar.vue)

**Vấn đề:** 302 dòng trong một component đơn, bao gồm render loop phức tạp và conditional logic.

**Cách xử lý:** Tách thành sub-components:
- `SidebarMenuGroup.vue` — render một nhóm menu
- `SidebarMenuItem.vue` — render một mục đơn lẻ

---

### 7.3. Calendar.vue quá lớn (375 dòng)

**File:** [src/views/Others/Calendar.vue](../src/views/Others/Calendar.vue)

**Cách xử lý:** Tách form thêm/sửa sự kiện ra component `CalendarEventForm.vue` riêng.

---

## 8. TypeScript Types 🟡

### 8.1. Type User quá sơ sài

**File:** [src/types/user.ts](../src/types/user.ts)

**Vấn đề:** Chỉ có 5 dòng, thiếu nhiều type cần thiết cho auth flow.

**Cách xử lý:** Tạo thêm [src/types/auth.ts](../src/types/auth.ts):
```typescript
export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface User {
  id: string
  email: string
  name: string
  role: 'Admin' | 'User' | 'Manager'
}
```

---

## 9. Package & Scripts 🟡

### 9.1. Thiếu scripts cần thiết

**File:** [package.json](../package.json)

**Vấn đề:** Thiếu script test, script lint riêng check/fix, không có Vitest.

**Cách xử lý:**
```json
{
  "scripts": {
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "format": "prettier --write src/",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vue/test-utils": "^2.4.0"
  }
}
```

---

### 9.2. Dependency beta trong production

**File:** [package.json](../package.json)

**Vấn đề:** `"dropzone": "^6.0.0-beta.2"` — dùng bản beta có thể có breaking changes bất ngờ.

**Cách xử lý:** Kiểm tra phiên bản stable mới nhất của dropzone và upgrade, hoặc xem xét thay bằng thư viện upload phổ biến hơn (`vue-dropzone`, `filepond`).

---

## 10. Icons 🟢

### 10.1. Duy trì song song 50+ icon tự viết và Lucide

**File:** [src/icons/](../src/icons/)

**Vấn đề:** 50+ SVG icon component tự tạo trong khi `lucide-vue-next` đã được cài — trùng lặp, tốn công bảo trì, tăng bundle size.

**Cách xử lý:** Audit từng icon trong `src/icons/` — icon nào Lucide đã có thì migrate, chỉ giữ lại icon custom (logo, branded icons).

```typescript
// Thay vì dùng src/icons/HomeIcon.vue
import { Home } from 'lucide-vue-next'
```

---

## 11. CSS & Styling 🟢

### 11.1. Inline styles thay vì Tailwind classes

**Files:** Nhiều file trong [src/views/Admin/](../src/views/Admin/)

**Vấn đề:** Nhiều chỗ dùng `style="display: flex; justify-content: space-between; align-items: center"` thay vì Tailwind utilities.

**Cách xử lý:**
```html
<!-- Trước -->
<div style="display: flex; justify-content: space-between; align-items: center">

<!-- Sau -->
<div class="flex justify-between items-center">
```

---

## 12. Error Handling & UX 🟢

### 12.1. Không có global error boundary

**Vấn đề:** Không có Vue error boundary, không có xử lý `unhandledrejection`. Lỗi runtime trong component sẽ crash toàn bộ app.

**Cách xử lý:** Thêm vào [src/main.ts](../src/main.ts):
```typescript
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
  ElNotification.error({
    title: 'Đã xảy ra lỗi',
    message: 'Vui lòng thử lại hoặc liên hệ hỗ trợ.',
  })
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
})
```

---

### 12.2. Thiếu alt text trên ảnh 404

**File:** [src/views/Errors/FourZeroFour.vue](../src/views/Errors/FourZeroFour.vue)

**Cách xử lý:**
```html
<img src="/images/error/404.svg" alt="Trang không tìm thấy" loading="lazy" class="dark:hidden" />
```

---

## Tóm tắt theo mức độ ưu tiên

| # | Vấn đề | File | Ưu tiên | Effort |
|---|--------|------|---------|--------|
| 1 | Auth guards không thực thi | `router/index.ts` | 🔴 | 20 phút |
| 2 | Thiếu catch-all 404 route | `router/index.ts` | 🔴 | 5 phút |
| 3 | Luồng đăng nhập chưa hoàn chỉnh | `Auth/Signin.vue` | 🔴 | 2 giờ |
| 4 | File backup auth trong VCS | `Auth/*.vue` | 🔴 | 5 phút |
| 5 | Pinia đăng ký sau Router | `main.ts` | 🟠 | 5 phút |
| 6 | Hardcode baseURL API | `axios.ts` | 🟠 | 10 phút |
| 7 | Không xử lý lỗi 401 | `axios.ts` | 🟠 | 15 phút |
| 8 | Xử lý lỗi trùng lặp 2 tầng | `axios.ts` + `utils/api.ts` | 🟠 | 15 phút |
| 9 | Thiếu .env config & typing | project root | 🟠 | 20 phút |
| 10 | Singleton state trong composable | `composables/jira/` | 🟡 | 1 giờ |
| 11 | Prop types sai trong Button | `ui/Button.vue` | 🟡 | 30 phút |
| 12 | AppSidebar 302 dòng | `layout/AppSidebar.vue` | 🟡 | 1 giờ |
| 13 | Calendar.vue 375 dòng | `views/Others/Calendar.vue` | 🟡 | 1 giờ |
| 14 | Type User sơ sài | `types/user.ts` | 🟡 | 30 phút |
| 15 | Thiếu test scripts & Vitest | `package.json` | 🟡 | 30 phút |
| 16 | Dependency beta (dropzone) | `package.json` | 🟡 | 10 phút |
| 17 | 50+ icon tự viết vs Lucide | `src/icons/` | 🟢 | 2 giờ |
| 18 | Inline styles thay vì Tailwind | `views/Admin/**` | 🟢 | 2 giờ |
| 19 | Không có global error boundary | `main.ts` | 🟢 | 30 phút |
| 20 | Thiếu alt text trên ảnh | `FourZeroFour.vue` | 🟢 | 5 phút |
