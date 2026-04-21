# Debug Modal Layout Shift

## Cách kiểm tra:

### 1. Mở Browser Console (F12)
Khi load trang, bạn sẽ thấy log:
```
Scrollbar width: 17
```
(Hoặc số khác tùy browser/OS)

### 2. Kiểm tra CSS Variable
Trong Console, chạy:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-width')
```
Kết quả mong đợi: `"17px"` hoặc tương tự

### 3. Kiểm tra Body Class
**Trước khi mở modal:**
```javascript
document.body.classList
```
Kết quả: Không có `el-popup-parent--hidden`

**Sau khi mở modal:**
```javascript
document.body.classList
```
Kết quả: Có `el-popup-parent--hidden`

### 4. Kiểm tra Padding
**Sau khi mở modal:**
```javascript
getComputedStyle(document.body).paddingRight
getComputedStyle(document.querySelector('header.sticky')).paddingRight
```
Kết quả mong đợi: Cả hai đều return `"17px"` (hoặc giá trị scrollbar width)

### 5. Kiểm tra Visual
1. Mở trang có scroll (content dài)
2. Để ý vị trí header
3. Click mở modal
4. Header KHÔNG được dịch sang phải
5. Đóng modal
6. Header vẫn ở vị trí cũ

## Nếu vẫn không hoạt động:

### Check 1: Scrollbar width có được tính đúng?
```javascript
// Chạy trong console
const outer = document.createElement('div')
outer.style.visibility = 'hidden'
outer.style.overflow = 'scroll'
document.body.appendChild(outer)
const inner = document.createElement('div')
outer.appendChild(inner)
const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
document.body.removeChild(outer)
console.log('Scrollbar width:', scrollbarWidth)
```

### Check 2: CSS có được apply?
```javascript
// Check body padding khi modal mở
document.body.classList.contains('el-popup-parent--hidden')
// true = modal đang mở
```

### Check 3: Element Plus có override không?
```javascript
// Check inline styles
document.body.style.paddingRight
// Nếu empty hoặc khác với CSS variable = bị override
```

## Giải pháp thay thế (nếu vẫn không work):

Thêm vào `src/assets/main.css`:
```css
/* Force override Element Plus */
body.el-popup-parent--hidden {
  padding-right: 17px !important; /* Hardcode cho Windows */
}

body.el-popup-parent--hidden header.sticky {
  padding-right: 17px !important;
}
```

## Common Issues:

1. **Scrollbar width = 0**: Browser ẩn scrollbar (Mac overlay scrollbars)
   - Giải pháp: Không cần fix, không có layout shift

2. **CSS không apply**: CSS bị cache
   - Giải pháp: Hard refresh (Ctrl+Shift+R)

3. **Element Plus override**: Inline style cao hơn
   - Giải pháp: Dùng `!important` và check specificity

4. **Header không có class `sticky`**: Selector sai
   - Giải pháp: Check HTML của header
