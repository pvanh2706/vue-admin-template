# Hướng dẫn: Modal tự động sinh scroll khi nội dung dài (Sử dụng el-scrollbar)

## Giải pháp

Sử dụng **Element Plus native component `el-scrollbar`** được tích hợp sẵn trong `AppDialog`. Đây là cách tốt nhất và được Element Plus recommend.

## Cách hoạt động

### 1. Component el-scrollbar được wrap trong Dialog

File `AppDialog.vue` đã tích hợp sẵn `el-scrollbar`:

```vue
<template>
  <el-dialog ...>
    <template #header>
      <slot name="header" />
    </template>
    
    <!-- 🔥 el-scrollbar tự động xử lý scroll -->
    <el-scrollbar :max-height="maxHeight" :always="alwaysShowScrollbar">
      <slot />
    </el-scrollbar>
    
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
```

### 2. Props mới trong AppDialog

```typescript
interface Props {
  // ... các props khác
  maxHeight?: string            // Max height cho scrollbar (default: '70vh')
  alwaysShowScrollbar?: boolean // Luôn hiển thị scrollbar (default: false)
  top?: string                  // Khoảng cách từ top viewport (default: '5vh')
  headerClass?: string          // Custom class cho dialog header  
  footerClass?: string          // Custom class cho dialog footer
}
```

### 3. Tính năng của el-scrollbar

✅ **Native Element Plus component**: Tích hợp hoàn hảo với hệ thống  
✅ **Auto-hide scrollbar**: Chỉ hiện khi hover (như macOS)  
✅ **Smooth scrolling**: Cuộn mượt mà  
✅ **Dark mode support**: Tự động theo theme  
✅ **Touch friendly**: Hỗ trợ touch devices  
✅ **Performance**: Tối ưu hóa cho performance  
✅ **Accessibility**: Hỗ trợ keyboard navigation  

## Ưu điểm so với các cách khác

| Feature | Custom CSS | body-class | **el-scrollbar** ✅ |
|---------|------------|------------|---------------------|
| **Native Element Plus** | ❌ | ⚠️ | ✅ |
| **Auto-hide scrollbar** | ❌ | ❌ | ✅ |
| **Smooth scroll** | ⚠️ | ⚠️ | ✅ |
| **Dark mode** | ⚠️ Manual | ⚠️ Manual | ✅ Auto |
| **Performance** | ⚠️ | ⚠️ | ✅ Optimized |
| **Touch support** | ❌ | ❌ | ✅ |
| **Maintainability** | ❌ | ⚠️ | ✅ |
| **Code amount** | 🔴 Nhiều CSS | 🟡 Vừa | 🟢 Minimal |

## Sử dụng

### Cách 1: Mặc định (Tự động scroll, max-height: 70vh)

```vue
<AppDialog v-model="dialogVisible" title="Thêm chi nhánh" :width="500">
    <BranchForm />
    <!-- Tự động có scroll khi nội dung > 70vh -->
    <template #footer>
        <AppButton @click="dialogVisible = false">Hủy bỏ</AppButton>
        <AppButton variant="primary">Lưu</AppButton>
    </template>
</AppDialog>
```

### Cách 2: Tùy chỉnh max-height

```vue
<AppDialog 
  v-model="dialogVisible" 
  title="Form dài"
  :width="600"
  maxHeight="85vh"
>
    <LongForm />
</AppDialog>
```

### Cách 3: Luôn hiển thị scrollbar

```vue
<AppDialog 
  v-model="dialogVisible" 
  title="Always Scroll"
  :alwaysShowScrollbar="true"
>
    <MyForm />
</AppDialog>
```

### Cách 4: Kết hợp nhiều options

```vue
<AppDialog 
  v-model="dialogVisible" 
  title="Custom Dialog"
  :width="700"
  top="5vh"
  maxHeight="80vh"
  :alwaysShowScrollbar="false"
  :draggable="true"
>
    <ComplexForm />
    <template #footer>
        <AppButton>Hủy</AppButton>
        <AppButton variant="primary">Lưu</AppButton>
    </template>
</AppDialog>
```

## Element Plus Scrollbar Features

### Props hỗ trợ

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `maxHeight` | string | '70vh' | Chiều cao tối đa, auto-scroll khi vượt quá |
| `alwaysShowScrollbar` | boolean | false | Luôn hiển thị scrollbar (không auto-hide) |

### Auto-hide behavior

Mặc định, scrollbar sẽ:
- ✅ **Ẩn** khi không hover
- ✅ **Hiện** khi hover vào content
- ✅ **Hiện** khi đang scroll
- ✅ **Mượt mà** với animation

### Scrollbar styling

Element Plus tự động style scrollbar theo theme:
- 🎨 **Light mode**: Scrollbar màu xám nhạt
- 🌙 **Dark mode**: Scrollbar màu sáng trên nền tối
- ✨ **Smooth**: Border radius và transitions

## Ví dụ thực tế

### Form đăng ký với nhiều fields

```vue
<template>
  <AppDialog 
    v-model="registerVisible" 
    title="Đăng ký tài khoản"
    :width="600"
    maxHeight="75vh"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="Họ tên">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <!-- ... 20+ fields more ... -->
    </el-form>
    
    <template #footer>
      <AppButton @click="registerVisible = false">Hủy</AppButton>
      <AppButton variant="primary" @click="handleSubmit">Đăng ký</AppButton>
    </template>
  </AppDialog>
</template>
```

### Table trong modal

```vue
<template>
  <AppDialog 
    v-model="tableVisible" 
    title="Danh sách sản phẩm"
    :width="900"
    maxHeight="70vh"
  >
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="name" label="Tên" />
      <el-table-column prop="price" label="Giá" />
      <!-- ... -->
    </el-table>
  </AppDialog>
</template>
```

## Tùy chỉnh nâng cao

### Thay đổi scroll behavior

Nếu muốn scroll behavior khác, có thể access el-scrollbar ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { ScrollbarInstance } from 'element-plus'

const scrollbarRef = ref<ScrollbarInstance>()

// Scroll to top
const scrollToTop = () => {
  scrollbarRef.value?.setScrollTop(0)
}

// Scroll to specific position
const scrollTo = (position: number) => {
  scrollbarRef.value?.setScrollTop(position)
}
</script>
```

### CSS overrides (nếu cần)

```vue
<style scoped>
/* Custom scrollbar width */
:deep(.el-scrollbar__bar.is-vertical) {
  width: 8px;
}

/* Custom scrollbar color */
:deep(.el-scrollbar__thumb) {
  background-color: var(--el-color-primary);
}
</style>
```

## So sánh với cách cũ

### ❌ Cách cũ (Custom CSS)
```css
/* Phải tự viết CSS, maintain khó */
.app-dialog-body-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
.app-dialog-body-scroll::-webkit-scrollbar { /* ... */ }
.app-dialog-body-scroll::-webkit-scrollbar-thumb { /* ... */ }
```

### ✅ Cách mới (el-scrollbar)
```vue
<!-- Chỉ cần dùng component -->
<el-scrollbar max-height="70vh">
  <slot />
</el-scrollbar>
```

## Lưu ý

- ✅ `el-scrollbar` là component chính thức của Element Plus
- ✅ Không cần CSS custom
- ✅ Tự động responsive
- ✅ Hỗ trợ đầy đủ keyboard (arrow keys, page up/down, home/end)
- ✅ Touch và mouse wheel đều smooth
- ✅ Max-height mặc định: **70vh** (có thể thay đổi qua props)

## Tài liệu tham khảo

- [Element Plus Scrollbar](https://element-plus.org/en-US/component/scrollbar.html)
- [Element Plus Dialog](https://element-plus.org/en-US/component/dialog.html)
