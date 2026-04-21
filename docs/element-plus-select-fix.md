# Fix: Element Plus el-select không hiển thị giá trị đã chọn

## Vấn đề

Khi sử dụng `el-select` của Element Plus với Tailwind CSS v4, giá trị đã chọn (số) không hiển thị trên giao diện, mặc dù giá trị vẫn được nhận đúng trong logic.

### Triệu chứng
- Chọn option trong dropdown → giá trị không hiển thị trong ô select
- Inspect DevTools thấy element có class `is-hidden` hoặc `is-transparent`
- Xóa class `is-hidden` thủ công → số hiển thị lại

## Nguyên nhân

### 1. Xung đột CSS giữa Tailwind CSS v4 và Element Plus

Tailwind CSS v4 sử dụng `@import 'tailwindcss'` với CSS reset mạnh trong `@layer base`. Reset này có thể ghi đè các styles của Element Plus.

### 2. Element Plus sử dụng class động

Element Plus sử dụng các class như:
- `.is-hidden`: Ẩn input wrapper khi không ở chế độ filterable
- `.is-transparent`: Set `opacity: 0` cho placeholder khi có giá trị

Khi CSS bị xung đột, các class này có thể ẩn luôn cả giá trị đã chọn.

### 3. Thứ tự import CSS

```typescript
// main.ts - Thứ tự đúng
import 'element-plus/dist/index.css'    // 1. Element Plus trước
import './assets/main.css'              // 2. Tailwind (trong main.css) sau
```

Mặc dù thứ tự import đúng, nhưng `@import 'tailwindcss'` trong `main.css` vẫn có thể gây conflict do cách CSS Layers hoạt động.

## Giải pháp

### CSS Override trong Component

Thêm CSS sau vào component sử dụng `el-select` (không dùng `scoped`):

```vue
<style>
/* Fix: Hiển thị giá trị đã chọn trong el-select */
.el-select .el-select__placeholder {
    display: inline !important;
    opacity: 1 !important;
}

.el-select .el-select__placeholder.is-transparent {
    opacity: 1 !important;
    color: var(--el-text-color-regular, #606266) !important;
}

/* Fix: Căn giữa số trong el-select */
.el-select .el-select__wrapper {
    display: flex !important;
    align-items: center !important;
}

.el-select .el-select__selection {
    display: flex !important;
    align-items: center !important;
}

.el-select .el-select__placeholder {
    line-height: normal !important;
    transform: none !important;
    top: auto !important;
    position: static !important;
}
</style>
```

### Giải thích từng phần

| CSS Rule | Mục đích |
|----------|----------|
| `.el-select__placeholder { opacity: 1 }` | Hiển thị placeholder (chứa giá trị đã chọn) |
| `.is-transparent { opacity: 1 }` | Ghi đè class ẩn của Element Plus |
| `align-items: center` | Căn giữa nội dung theo chiều dọc |
| `position: static` | Loại bỏ positioning gây lệch vị trí |

## Lưu ý quan trọng

1. **Không dùng `scoped`**: CSS cần apply global để override Element Plus
2. **Dùng `!important`**: Cần thiết để ghi đè inline styles của Element Plus
3. **Kiểm tra thứ tự import**: Đảm bảo Element Plus CSS được import TRƯỚC Tailwind

## Files liên quan

- `src/main.ts` - Thứ tự import CSS
- `src/assets/main.css` - Chứa Tailwind CSS
- `src/components/ui/element-plus/BasePagination.vue` - Component có fix

## Tham khảo

- [Element Plus Select Component](https://element-plus.org/en-US/component/select.html)
- [Tailwind CSS v4 Migration](https://tailwindcss.com/docs/upgrade-guide)
