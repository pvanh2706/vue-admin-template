# CLAUDE.md — Hướng dẫn AI làm việc với dự án này

## Tổng quan dự án

Vue 3 Admin Template (CodeOn POS) — dashboard quản lý cửa hàng/sản phẩm.
Stack: Vue 3 + TypeScript + Tailwind CSS + Element Plus + Vite.

---

## Cấu trúc thư mục quan trọng

```
src/
├── components/
│   ├── layout/          ← Layout system (KHÔNG sửa trừ khi được yêu cầu)
│   │   ├── AdminLayout.vue     ← wrapper chính, dùng <slot> cho content
│   │   ├── AppSidebar.vue      ← sidebar với menu groups
│   │   ├── AppHeader.vue       ← header
│   │   └── FullScreenLayout.vue ← dùng cho trang Auth (không có sidebar)
│   └── ui/element-plus/ ← wrapper components (ưu tiên dùng lại)
├── views/               ← mỗi trang là 1 file, bọc trong AdminLayout
├── composables/
│   └── useSidebar.ts    ← quản lý state sidebar (KHÔNG tái tạo)
└── router/index.ts      ← thêm route mới ở đây
```

---

## Layout system

### Trang thông thường (có sidebar + header)
Mọi view đều bọc trong `AdminLayout`:

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <!-- content ở đây -->
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
</script>
```

### Trang Auth (không có sidebar)
Dùng `FullScreenLayout` thay AdminLayout.

---

## Component UI — Ưu tiên dùng lại, không tự tạo mới

Tất cả nằm trong `src/components/ui/element-plus/`:

| Component | Dùng khi |
|---|---|
| `AppButton` | Mọi nút bấm |
| `AppInput` | Text input |
| `AppSelect` | Dropdown chọn |
| `AppTable` | Bảng dữ liệu |
| `AppDialog` | Modal/popup |
| `AppDrawer` | Drawer trượt từ cạnh |
| `AppForm` + `AppFormItem` | Form có validation |
| `AppPagination` / `BasePagination` | Phân trang |
| `AppCheckbox` | Checkbox |
| `AppRadio` | Radio button |
| `AppSwitch` | Toggle switch |
| `AppTabs` | Tabs |
| `AppTag` | Badge/tag |

**Quy tắc:** Không dùng `el-button`, `el-input`... trực tiếp — luôn dùng wrapper `App*` tương ứng.

---

## Sidebar — Quy tắc đặc biệt

`AppSidebar.vue` có logic phức tạp, **không được tái tạo**:

- `useSidebar()` composable — quản lý `isExpanded`, `isMobileOpen`, `isHovered`, `openSubmenu`
- `menuGroups` — cấu trúc dữ liệu menu (mảng groups → items → subItems)
- `isActive(path)` — highlight menu item theo route hiện tại
- `toggleSubmenu()` / `isSubmenuOpen()` — mở/đóng submenu
- `startTransition` / `endTransition` — animation height cho submenu

**Khi chỉnh sửa Sidebar:** Chỉ thay `<template>`, giữ nguyên toàn bộ `<script setup>`.

### Cấu trúc menuGroups

```ts
const menuGroups = [
  {
    title: 'Tên nhóm',
    items: [
      {
        icon: SomeIcon,        // Vue component icon
        name: 'Tên menu',
        path: '/duong-dan',    // nếu là link trực tiếp
        subItems: [            // nếu có dropdown
          { name: 'Sub item', path: '/sub', pro: false, new: false }
        ]
      }
    ]
  }
]
```

---

## Thêm trang mới — quy trình chuẩn

### 1. Tạo view file
```
src/views/TenModule/TenTrang.vue
```

### 2. Cấu trúc view chuẩn

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />
    <!-- content -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const pageTitle = ref('Tên trang')
</script>
```

### 3. Thêm route vào `src/router/index.ts`

```ts
{
  path: '/ten-trang',
  name: 'TenTrang',
  component: () => import('../views/TenModule/TenTrang.vue'),
  meta: { title: 'Tên trang' },
}
```

### 4. Thêm menu vào `AppSidebar.vue`

Thêm item vào mảng `menuGroups` trong `<script setup>`:
```ts
{
  icon: SomeIcon,
  name: 'Tên menu',
  path: '/ten-trang',
}
```

---

## Quy tắc khi convert thiết kế từ Stitch

Khi nhận HTML/Tailwind code export từ Google Stitch:

### Với trang mới (view mới)
1. Bọc toàn bộ content trong `AdminLayout`
2. Giữ nguyên Tailwind classes từ Stitch
3. Thay data cứng (text, số, danh sách) bằng Vue reactive (`ref`, `reactive`)
4. Thay HTML input/button/table thuần bằng component `App*` tương ứng
5. Thêm `v-for` cho danh sách lặp, `v-if` cho điều kiện hiện/ẩn

### Với component có sẵn (AppSidebar, AppHeader...)
> **Chỉ thay `<template>`, giữ nguyên `<script setup>`**

Cụ thể:
- KHÔNG xóa bất kỳ `const`, `ref`, `computed`, `function` nào trong `<script setup>`
- KHÔNG xóa `import` trong `<script setup>`
- KHÔNG tái tạo logic đã có (useSidebar, menuGroups, isActive...)
- CHỈ thay đổi HTML structure và Tailwind classes trong `<template>`
- Giữ nguyên tất cả Vue bindings: `v-for`, `v-if`, `:class`, `@click`, `router-link`, `<component :is>`

### Ví dụ đúng khi AI được yêu cầu "cập nhật giao diện Sidebar theo thiết kế Stitch"

```
✅ Thay class Tailwind trên <aside>
✅ Thay cấu trúc HTML bên trong item menu
✅ Thêm icon mới, thay đổi màu sắc
❌ Xóa hoặc sửa useSidebar()
❌ Viết lại logic isActive, toggleSubmenu
❌ Xóa menuGroups
❌ Bỏ transition hooks
```

---

## Pattern trang có bảng + dialog

Xem mẫu thực tế tại `src/views/Admin/ConfigStore/ConfigStore.vue`:
- `el-table` với custom header/cell template
- `AppDialog` cho form thêm/sửa
- `BasePagination` với `v-model:page` và `v-model:pageSize`
- `reactive()` cho query params

---

## Pattern trang có form

Xem mẫu thực tế tại `src/views/Product/Product.vue`:
- Toggle giữa list view và form view bằng `showForm ref`
- Truyền data qua props, nhận event qua emit
- `formMode: 'add' | 'edit'` để phân biệt chế độ

---

## Dark mode

Dự án hỗ trợ dark mode. Khi viết Tailwind classes luôn thêm variant `dark:`:
```html
<div class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-400">
```

---

## TypeScript

- Luôn dùng `<script setup lang="ts">`
- Định nghĩa interface cho data type, đặt trong file `types/` cùng thư mục với view
- Không dùng `any`
