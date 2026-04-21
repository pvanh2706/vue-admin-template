# AppDialog Centering System

## Tổng quan
Modal dialog được căn giữa theo content area (không tính sidebar và header) để tạo trải nghiệm tốt hơn cho người dùng.

## Cách hoạt động

### 1. **Tính toán Offset**

#### Chiều ngang (Horizontal):
- **Sidebar collapsed** (90px) → offset = 45px (nửa chiều rộng)
- **Sidebar expanded** (290px) → offset = 145px (nửa chiều rộng)
- Dialog sẽ dịch sang phải để căn giữa với content area

#### Chiều dọc (Vertical):
- **Header height**: ~64px
- **Header offset**: 32px (nửa chiều cao)
- Dialog sẽ dịch xuống để căn giữa với content area

### 2. **Công thức CSS**

```css
transform: translate(
  calc(-50% + var(--sidebar-offset)),  /* Căn giữa + dịch phải */
  calc(-50% + var(--header-offset))    /* Căn giữa + dịch xuống */
)
```

- `-50%`: Căn giữa theo viewport
- `+ offset`: Dịch chuyển để compensate cho sidebar/header
- Kết quả: Dialog ở giữa content area

### 3. **Cơ chế hoạt động**

```
┌─────────────────────────────────────────┐
│           Header (64px)                 │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │      Content Area            │
│ (90/290) │  ┌──────────────┐           │
│          │  │   DIALOG     │           │
│          │  │  (centered)  │           │
│          │  └──────────────┘           │
│          │                              │
└──────────┴──────────────────────────────┘
```

Dialog được đặt ở chính giữa content area, không phải giữa viewport.

### 4. **Tính năng động**

- ✅ Auto-adjust khi sidebar expand/collapse
- ✅ Smooth transition (0.3s ease-in-out)
- ✅ Responsive: Desktop có offset, mobile không có
- ✅ Có thể tắt bằng prop `center-in-content="false"`
- ✅ **Prevent layout shift**: Tự động compensate cho scrollbar khi modal mở

### 5. **Xử lý Layout Shift (Scrollbar)**

Khi modal mở, Element Plus ẩn scrollbar để prevent background scroll. Điều này gây ra layout shift (header và content bị dịch sang phải).

**Giải pháp:**
1. Tính chiều rộng scrollbar: `window.innerWidth - document.documentElement.clientWidth`
2. Khi modal mở: Thêm `padding-right` vào body và header bằng chiều rộng scrollbar
3. Khi modal đóng: Xóa padding để restore layout

```typescript
// Prevent layout shift
const scrollbarWidth = getScrollbarWidth() // ~15-17px
document.body.style.paddingRight = `${scrollbarWidth}px`
header.style.paddingRight = `${scrollbarWidth}px`
```

**Kết quả:**
- ❌ Trước: Header bị dịch sang phải, xuất hiện khoảng trắng
- ✅ Sau: Header giữ nguyên vị trí, không có khoảng trắng

## Sử dụng

### Mặc định (auto-center):
```vue
<AppDialog v-model="dialogVisible" title="My Dialog">
  <p>Content here</p>
</AppDialog>
```

### Tắt auto-center:
```vue
<AppDialog 
  v-model="dialogVisible" 
  title="My Dialog"
  :center-in-content="false"
>
  <p>Content here</p>
</AppDialog>
```

## Files liên quan

1. **Component**: `src/components/ui/element-plus/AppDialog.vue`
   - Tính toán offsets
   - Set CSS variables
   - Watch sidebar state

2. **Global CSS**: `src/assets/main.css`
   - Transform rules
   - Responsive breakpoints
   - !important overrides

3. **Layout**: `src/components/layout/AdminLayout.vue`
   - Sidebar width: 90px (collapsed), 290px (expanded)
   - Header height: ~64px

## Responsive Behavior

- **Desktop (≥1024px)**: Căn giữa với content area (có offsets)
- **Mobile (<1024px)**: Căn giữa viewport (không có offsets)

## Performance

- Delay 50ms để đảm bảo DOM rendered
- CSS variables được update trực tiếp trên element
- Smooth transitions không gây lag
- Scrollbar width tính toán một lần khi dialog mở
- Padding được restore khi dialog đóng

## Troubleshooting

### Vấn đề: Header bị dịch sang phải khi modal mở
**Nguyên nhân:** Scrollbar biến mất khi modal mở, làm layout shift

**Giải pháp:** Đã tự động xử lý trong component
- Tính scrollbar width
- Thêm padding-right vào body và header
- Restore khi đóng modal

### Vấn đề: Dialog không căn giữa đúng
**Kiểm tra:**
1. Prop `center-in-content` có được set `true`?
2. Class `app-ui-dialog-centered` có được apply?
3. CSS variables `--sidebar-offset` và `--header-offset` có giá trị đúng?
4. Breakpoint >= 1024px?
