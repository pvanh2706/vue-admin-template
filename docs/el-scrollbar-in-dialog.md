# Element Plus el-scrollbar trong Dialog - Quick Guide

## 🎯 Tại sao dùng el-scrollbar?

### ❌ Các cách khác (không nên dùng)

1. **Custom CSS với overflow**
   ```css
   .dialog-body {
     max-height: 70vh;
     overflow-y: auto;
   }
   ```
   - ❌ Scrollbar xấu (native browser)
   - ❌ Không consistent giữa các browser
   - ❌ Không auto-hide
   - ❌ Khó custom

2. **body-class với custom scrollbar**
   ```css
   ::-webkit-scrollbar { width: 6px; }
   ::-webkit-scrollbar-thumb { /* ... */ }
   ```
   - ❌ Chỉ work trên Webkit browsers
   - ❌ Nhiều CSS code
   - ❌ Khó maintain

### ✅ el-scrollbar (Best Practice)

```vue
<el-scrollbar max-height="70vh">
  <YourContent />
</el-scrollbar>
```

- ✅ Native Element Plus component
- ✅ Auto-hide scrollbar (như macOS)
- ✅ Cross-browser consistent
- ✅ Dark mode support
- ✅ Touch friendly
- ✅ Minimal code

## 🚀 Sử dụng trong AppDialog

### Cấu trúc hiện tại

```vue
<template>
  <el-dialog ...>
    <template #header>
      <slot name="header" />
    </template>
    
    <!-- ✨ el-scrollbar được tích hợp sẵn -->
    <el-scrollbar :max-height="maxHeight" :always="alwaysShowScrollbar">
      <slot />
    </el-scrollbar>
    
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
```

### Props

```typescript
{
  maxHeight: string = '70vh'            // Max height
  alwaysShowScrollbar: boolean = false  // Luôn hiển thị
}
```

## 📝 Ví dụ sử dụng

### 1. Basic (Auto scroll khi > 70vh)

```vue
<AppDialog v-model="visible" title="Form">
  <VeryLongForm />
  <!-- Tự động scroll nếu form > 70vh -->
</AppDialog>
```

### 2. Custom max-height

```vue
<AppDialog 
  v-model="visible" 
  title="Custom"
  maxHeight="85vh"
>
  <Content />
</AppDialog>
```

### 3. Always show scrollbar

```vue
<AppDialog 
  v-model="visible"
  :alwaysShowScrollbar="true"
>
  <Content />
</AppDialog>
```

### 4. Kết hợp với table

```vue
<AppDialog 
  v-model="visible"
  title="Products"
  :width="900"
  maxHeight="70vh"
>
  <el-table :data="products">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="price" label="Price" />
  </el-table>
</AppDialog>
```

### 5. Form có nhiều sections

```vue
<AppDialog 
  v-model="visible"
  title="Registration"
  maxHeight="75vh"
>
  <el-form :model="form">
    <!-- Section 1: Personal Info -->
    <el-divider>Personal Information</el-divider>
    <el-form-item label="Name">
      <el-input v-model="form.name" />
    </el-form-item>
    <!-- ... 10 more fields -->
    
    <!-- Section 2: Address -->
    <el-divider>Address</el-divider>
    <el-form-item label="Street">
      <el-input v-model="form.street" />
    </el-form-item>
    <!-- ... 10 more fields -->
    
    <!-- Section 3: Additional -->
    <el-divider>Additional Info</el-divider>
    <!-- ... more fields -->
  </el-form>
</AppDialog>
```

## 🎨 Behavior

### Auto-hide (Default)

```vue
<AppDialog v-model="visible">
  <Content />
</AppDialog>
```

- Scrollbar **ẩn** khi không hover
- Scrollbar **hiện** khi hover vào content
- Scrollbar **hiện** khi đang scroll
- **Smooth** animation

### Always show

```vue
<AppDialog 
  v-model="visible"
  :alwaysShowScrollbar="true"
>
  <Content />
</AppDialog>
```

- Scrollbar **luôn hiển thị**
- Useful cho users không quen auto-hide

## 🛠 Advanced Usage

### Access scrollbar methods (if needed)

Nếu cần control scrollbar programmatically, có thể extend AppDialog:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { ScrollbarInstance } from 'element-plus'

const scrollbarRef = ref<ScrollbarInstance>()

const scrollToTop = () => {
  scrollbarRef.value?.setScrollTop(0)
}

const scrollToBottom = () => {
  // Get scrollbar wrap element
  const wrap = scrollbarRef.value?.wrapRef
  if (wrap) {
    scrollbarRef.value?.setScrollTop(wrap.scrollHeight)
  }
}
</script>

<template>
  <el-scrollbar ref="scrollbarRef" max-height="70vh">
    <slot />
  </el-scrollbar>
</template>
```

### Custom scrollbar styling

```vue
<style scoped>
/* Thay đổi width của scrollbar */
:deep(.el-scrollbar__bar.is-vertical) {
  width: 8px;
}

/* Thay đổi màu thumb */
:deep(.el-scrollbar__thumb) {
  background-color: var(--el-color-primary);
  border-radius: 4px;
}

/* Scrollbar track */
:deep(.el-scrollbar__bar) {
  background-color: var(--el-fill-color-lighter);
}
</style>
```

## 📊 Comparison

| Feature | Native Scrollbar | Custom CSS | **el-scrollbar** |
|---------|-----------------|------------|------------------|
| Cross-browser | ⚠️ Inconsistent | ⚠️ Webkit only | ✅ Consistent |
| Auto-hide | ❌ | ❌ | ✅ |
| Smooth scroll | ⚠️ | ⚠️ | ✅ |
| Dark mode | ❌ | ⚠️ Manual | ✅ Auto |
| Touch support | ✅ | ❌ | ✅ |
| Code amount | 🟢 None | 🔴 Much | 🟢 Minimal |
| Maintainability | 🟢 | 🔴 | 🟢 |
| Performance | 🟢 | 🟡 | 🟢 Optimized |

## 💡 Tips

1. **Default max-height (70vh)** phù hợp cho hầu hết trường hợp
2. **Không nên set quá cao** (>85vh) để giữ UX tốt
3. **Dùng `alwaysShowScrollbar`** khi content chắc chắn sẽ scroll
4. **Kết hợp với `draggable`** để user có thể di chuyển dialog
5. **Test trên mobile** để đảm bảo touch scroll hoạt động tốt

## 🐛 Troubleshooting

### Scrollbar không xuất hiện?

- ✅ Check `maxHeight` prop
- ✅ Đảm bảo content > maxHeight
- ✅ Check console có error không

### Scrollbar luôn hiện (muốn auto-hide)?

```vue
<!-- Đảm bảo alwaysShowScrollbar = false hoặc không set -->
<AppDialog v-model="visible" :alwaysShowScrollbar="false">
```

### Scroll không smooth?

- ✅ Element Plus el-scrollbar đã tối ưu smooth scroll
- ✅ Nếu vẫn không smooth, check CSS `scroll-behavior`

### Content bị cut off?

- ✅ Tăng `maxHeight`
- ✅ Check content có `overflow: hidden` không

## 📚 Resources

- [Element Plus Scrollbar](https://element-plus.org/en-US/component/scrollbar.html)
- [Element Plus Dialog](https://element-plus.org/en-US/component/dialog.html)
- [Scrollbar API](https://element-plus.org/en-US/component/scrollbar.html#api)

## ✨ Best Practices Summary

```vue
<!-- ✅ GOOD: Simple and clean -->
<AppDialog v-model="visible" title="Form">
  <YourForm />
</AppDialog>

<!-- ✅ GOOD: Custom height when needed -->
<AppDialog v-model="visible" maxHeight="80vh">
  <LongContent />
</AppDialog>

<!-- ❌ BAD: Don't add custom scroll CSS -->
<AppDialog v-model="visible">
  <div style="max-height: 70vh; overflow-y: auto">
    <Content />
  </div>
</AppDialog>

<!-- ❌ BAD: Nested scrollbar -->
<AppDialog v-model="visible">
  <el-scrollbar>
    <Content />
  </el-scrollbar>
</AppDialog>
```

---

**TL;DR**: Chỉ cần dùng `AppDialog` như bình thường, `el-scrollbar` đã tích hợp sẵn với `maxHeight="70vh"` 🎉
