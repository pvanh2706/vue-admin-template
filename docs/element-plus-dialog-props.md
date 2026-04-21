# Element Plus Dialog Props - Quick Reference

## Các props Element Plus native được AppDialog hỗ trợ

### Layout & Position
```typescript
top: string = '5vh'              // Khoảng cách từ top viewport
alignCenter: boolean = true      // Căn giữa dialog
fullscreen: boolean = false      // Toàn màn hình
width: string | number = '50%'   // Chiều rộng dialog
```

### Custom Classes (Element Plus v2.9.3+)
```typescript
bodyClass: string = ''           // Class cho dialog body
headerClass: string = ''         // Class cho dialog header
footerClass: string = ''         // Class cho dialog footer
```

### Behavior
```typescript
modal: boolean = true                    // Hiển thị overlay
draggable: boolean = false              // Kéo thả dialog
destroyOnClose: boolean = true          // Destroy khi đóng
closeOnClickModal: boolean = false      // Đóng khi click overlay
closeOnPressEscape: boolean = true      // Đóng khi nhấn ESC
showClose: boolean = true               // Hiển thị nút close
```

## Ví dụ sử dụng

### 1. Dialog cơ bản với auto-scroll
```vue
<AppDialog v-model="visible" title="Form">
  <LongForm />
  <template #footer>
    <AppButton @click="visible = false">Đóng</AppButton>
  </template>
</AppDialog>
```

### 2. Dialog với custom position
```vue
<AppDialog 
  v-model="visible" 
  title="Near Top"
  top="5vh"
  :width="600"
>
  <MyContent />
</AppDialog>
```

### 3. Dialog draggable
```vue
<AppDialog 
  v-model="visible" 
  title="Drag Me"
  :draggable="true"
>
  <Content />
</AppDialog>
```

### 4. Dialog với custom body class
```vue
<template>
  <AppDialog 
    v-model="visible" 
    title="Custom"
    bodyClass="my-body"
  >
    <VeryLongContent />
  </AppDialog>
</template>

<style scoped>
:deep(.my-body) {
  max-height: 85vh;
  padding: 30px;
}
</style>
```

### 5. Dialog fullscreen
```vue
<AppDialog 
  v-model="visible" 
  title="Full Screen"
  :fullscreen="true"
>
  <FullContent />
</AppDialog>
```

### 6. Dialog không có overlay
```vue
<AppDialog 
  v-model="visible" 
  title="No Modal"
  :modal="false"
>
  <Content />
</AppDialog>
```

## Tính năng Auto-Scroll

### Mặc định
- Body tự động có scroll khi nội dung vượt quá **70vh**
- Scrollbar được custom đẹp (6px width)
- Header và footer không cuộn

### Tùy chỉnh max-height
```vue
<template>
  <AppDialog 
    v-model="visible"
    bodyClass="custom-height"
  >
    <Content />
  </AppDialog>
</template>

<style scoped>
:deep(.custom-height) {
  max-height: 90vh !important;
}
</style>
```

### Tắt scroll
```vue
<template>
  <AppDialog 
    v-model="visible"
    bodyClass="no-scroll"
  >
    <ShortContent />
  </AppDialog>
</template>

<style scoped>
:deep(.no-scroll) {
  max-height: none !important;
  overflow: visible !important;
}
</style>
```

## CSS Variables có sẵn

```css
/* Element Plus variables cho scrollbar */
--el-fill-color-lighter
--el-color-info-light-5
--el-color-info-light-3
--el-border-color-lighter

/* Custom variables của AppDialog */
--sidebar-offset
--header-offset
```

## Tips & Best Practices

1. **Sử dụng `top` thay vì CSS** để điều chỉnh vị trí
2. **Sử dụng `bodyClass`** thay vì global CSS
3. **Kết hợp với `draggable`** cho UX tốt hơn
4. **Đặt `destroyOnClose={true}`** để clear state khi đóng
5. **Sử dụng `:deep()`** trong scoped style để override

## Tài liệu tham khảo

- [Element Plus Dialog Official Docs](https://element-plus.org/en-US/component/dialog.html)
- [Element Plus Dialog API](https://element-plus.org/en-US/component/dialog.html#attributes)
