# Composables vs Pinia — Hướng dẫn sử dụng

## Tóm tắt nhanh

| | Composable | Pinia Store |
|---|---|---|
| **State sống ở đâu** | Trong component (mỗi lần gọi tạo instance mới) | Toàn cục (singleton, chia sẻ toàn app) |
| **Khi nào reset** | Khi component unmount | Tồn tại suốt vòng đời app |
| **DevTools** | ❌ | ✅ Vue DevTools Pinia tab |
| **Persist (localStorage)** | ❌ | ✅ pinia-plugin-persistedstate |
| **Phù hợp với** | Logic + state của 1 màn hình | State dùng chung nhiều nơi |

---

## Dùng Composable khi

### ✅ State chỉ cần trong 1 component hoặc 1 màn hình

```typescript
// Loading/result của một form submit → chỉ cần trong component đó
export function useCreateIssue() {
  const loading = ref(false)
  const result = ref(null)
  const execute = async (data) => { ... }
  return { loading, result, execute }
}
```

### ✅ Tái sử dụng logic (không phải state)

```typescript
// Logic xử lý date format → không cần lưu state
export function useDateFormat() {
  const formatDate = (date: Date) => ...
  const formatRelative = (date: Date) => ...
  return { formatDate, formatRelative }
}
```

### ✅ Logic gắn với lifecycle của component

```typescript
// Event listener gắn/gỡ theo component
export function useWindowSize() {
  const width = ref(window.innerWidth)
  onMounted(() => window.addEventListener('resize', handler))
  onUnmounted(() => window.removeEventListener('resize', handler))
  return { width }
}
```

### ✅ Wrap API calls với loading state

```typescript
// Mỗi component cần loading state riêng khi gọi API
export const useGetIssue = createComposable<string, JiraIssue>(jiraApi.getIssue)
```

---

## Dùng Pinia khi

### ✅ State cần chia sẻ giữa nhiều component

```typescript
// User info cần ở Header, Sidebar, và nhiều page khác
export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = computed(() => !!currentUser.value)
  return { currentUser, isAuthenticated }
})
```

### ✅ State cần persist qua reload trang

```typescript
// Theme, language, sidebar collapsed state
export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<'light' | 'dark'>('light')
  return { theme }
}, {
  persist: true  // dùng pinia-plugin-persistedstate
})
```

### ✅ Authentication & session

```typescript
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const login = async (credentials) => { ... }
  const logout = () => { token.value = null; user.value = null }
  return { token, user, login, logout }
})
```

### ✅ State cần debug/monitor trong DevTools

Pinia hiển thị toàn bộ state và mutations trong Vue DevTools — rất hữu ích khi debug.

---

## Ranh giới xám — cần cân nhắc

### Module-level singleton trong composable (anti-pattern)

Trong project hiện tại có pattern này ở `useJiraConfigState.ts`:

```typescript
// ⚠️ State khai báo ngoài function → tạo ra module singleton
const state = reactive({ config: null, loading: false })

export function useJiraConfigState() {
  return state  // mọi component đều dùng chung state này
}
```

**Vấn đề:** Hoạt động như Pinia nhưng thiếu DevTools, thiếu persistence, khó test.  
**Nên làm:** Chuyển sang Pinia store nếu state này thực sự cần chia sẻ.

### `useSidebar` với provide/inject

```typescript
// Dùng provide/inject để chia sẻ state → phức tạp không cần thiết
export function useSidebarProvider() { provide(SidebarSymbol, context) }
export function useSidebar() { return inject(SidebarSymbol) }
```

**Vấn đề:** Cần setup provider ở component cha, dễ gây lỗi nếu quên.  
**Nên làm:** Chuyển sang Pinia — đơn giản hơn, không cần provider.

---

## Sơ đồ quyết định

```
State này có cần dùng ở nhiều component/page không?
├── Không → Composable
│   └── Có gắn với lifecycle (mount/unmount) không?
│       ├── Có → Composable (dùng onMounted/onUnmounted)
│       └── Không → Composable thuần (chỉ là helper function)
└── Có → Pinia Store
    └── Có cần persist qua reload không?
        ├── Có → Pinia + pinia-plugin-persistedstate
        └── Không → Pinia store thông thường
```

---

## Quy tắc đặt tên & vị trí file

| Loại | Vị trí | Tên file | Tên function |
|---|---|---|---|
| Composable logic | `src/composables/` | `useXxx.ts` | `useXxx()` |
| Composable wrap API | `src/services/[module]/composables.ts` | — | `useXxx()` |
| Pinia store | `src/stores/` | `useXxxStore.ts` | `useXxxStore()` |

---

## Ví dụ thực tế trong project

| File | Loại | Lý do |
|---|---|---|
| `services/jira/composables.ts` | Composable ✅ | Loading/result per-component khi gọi Jira API |
| `composables/useSidebar.ts` | Nên → Pinia ⚠️ | Sidebar state chia sẻ toàn app |
| `composables/jira/useJiraConfigState.ts` | Nên → Pinia ⚠️ | Config state chia sẻ giữa nhiều component |
| (chưa có) `stores/useAuthStore.ts` | Pinia ✅ | Auth state cần chia sẻ + persist |
| (chưa có) `stores/useUserStore.ts` | Pinia ✅ | User info cần ở nhiều nơi |
