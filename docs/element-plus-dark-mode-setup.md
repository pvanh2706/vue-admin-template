# Hướng dẫn cấu hình Dark Mode cho Element Plus với Tailwind CSS

## Mục tiêu

Đồng bộ dark mode của Element Plus với Tailwind CSS, sử dụng chung cơ chế toggle class `dark` trên thẻ `<html>`.

## Các bước thực hiện

### 1. Tắt auto-import CSS của ElementPlusResolver

Trong file `vite.config.ts`, thêm option `importStyle: false`:

```typescript
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
  ],
})
```

**Lý do:** Ngăn ElementPlusResolver tự động inject CSS cho mỗi component, vì CSS đó sẽ được load sau và override lại CSS variables của chúng ta.

---

### 2. Import CSS Element Plus thủ công trong main.ts

Thứ tự import rất quan trọng:

```typescript
// 1. Import Element Plus CSS trước
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 2. Import Tailwind CSS / main.css
import './assets/main.css'

// 3. Import file override dark mode cuối cùng
import './assets/element-plus-dark.css'
```

**Thứ tự quan trọng vì:**
- CSS được load sau sẽ có độ ưu tiên cao hơn (cùng specificity)
- File override phải được load cuối cùng để có thể ghi đè CSS variables

---

### 3. Tạo file override CSS variables cho dark mode

Tạo file `src/assets/element-plus-dark.css`:

```css
/* Element Plus Dark Mode - Override CSS Variables */
html.dark {
  /* Table variables */
  --el-table-tr-bg-color: transparent !important;
  --el-table-bg-color: transparent !important;
  --el-table-header-bg-color: rgba(255, 255, 255, 0.05) !important;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05) !important;
  --el-table-current-row-bg-color: rgba(255, 255, 255, 0.05) !important;
  --el-table-border-color: #1d2939 !important;
  --el-table-text-color: #98a2b3 !important;
  --el-table-header-text-color: rgba(255, 255, 255, 0.9) !important;
  --el-table-fixed-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.36) !important;
  --el-table-expanded-cell-bg-color: transparent !important;
  
  /* General Element Plus colors */
  --el-bg-color: #101828 !important;
  --el-bg-color-page: #101828 !important;
  --el-bg-color-overlay: #1d2939 !important;
  --el-fill-color-blank: transparent !important;
  --el-border-color: #1d2939 !important;
  --el-border-color-light: #1d2939 !important;
  --el-border-color-lighter: rgba(255, 255, 255, 0.1) !important;
  --el-text-color-primary: rgba(255, 255, 255, 0.9) !important;
  --el-text-color-regular: #98a2b3 !important;
}
```

**Lưu ý:**
- Sử dụng `!important` để đảm bảo override thành công
- Màu sắc được lấy từ Tailwind theme của dự án:
  - `#101828` = `gray-900` (background chính)
  - `#1d2939` = `gray-800` (border)
  - `#98a2b3` = `gray-400` (text muted)

---

### 4. Hệ thống toggle dark mode

Dự án đã có sẵn `ThemeProvider.vue` để toggle class `dark` trên `<html>`:

```vue
<!-- src/components/layout/ThemeProvider.vue -->
<script setup>
watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})
</script>
```

Không cần tạo hệ thống toggle mới - Element Plus tự động nhận diện class `dark` trên `<html>`.

---

## Mapping màu Tailwind ↔ Element Plus

| Tailwind Class | Giá trị | Element Plus Variable |
|---------------|---------|----------------------|
| `dark:bg-gray-900` | `#101828` | `--el-bg-color` |
| `dark:bg-white/[0.03]` | `rgba(255,255,255,0.03)` | `--el-table-bg-color` |
| `dark:border-gray-800` | `#1d2939` | `--el-border-color`, `--el-table-border-color` |
| `dark:text-gray-400` | `#98a2b3` | `--el-text-color-regular`, `--el-table-text-color` |
| `dark:text-white/90` | `rgba(255,255,255,0.9)` | `--el-text-color-primary`, `--el-table-header-text-color` |

---

## Tham khảo

- [Element Plus Dark Mode Documentation](https://element-plus.org/en-US/guide/dark-mode.html)
- [Element Plus Theming](https://element-plus.org/en-US/guide/theming.html)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

## Troubleshooting

### CSS không được áp dụng?

1. **Kiểm tra thứ tự import** - File override phải được import cuối cùng
2. **Restart dev server** - Sau khi thay đổi `vite.config.ts`, cần restart
3. **Kiểm tra `importStyle: false`** - Đảm bảo đã tắt auto-import CSS
4. **Sử dụng `!important`** - Trong một số trường hợp cần thiết để override

### Bảng vẫn hiển thị màu đen?

- Đảm bảo file `element-plus-dark.css` được import sau `main.css`
- Kiểm tra DevTools → Elements → Computed để xem CSS variable nào đang được áp dụng
