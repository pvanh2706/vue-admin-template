# Workflow: Thiết kế với Google Stitch → Vue Component

## Tổng quan

Dự án đã có sẵn layout (Sidebar + Header). Khi thiết kế trang mới, bạn chỉ cần:
1. Thiết kế phần **content** trong Stitch (không cần vẽ sidebar/header)
2. Export HTML/Tailwind code từ Stitch
3. Nhờ AI convert sang Vue component
4. Bọc trong `AdminLayout` và thêm route

---

## Bước 1: Thiết kế trong Stitch

**Chỉ thiết kế phần content bên trong**, không vẽ sidebar/header vì dự án đã có sẵn.

```
┌─────────────────────────────────────────────┐
│  Sidebar  │  Header                          │  ← có sẵn, không cần thiết kế
│  (có sẵn) ├──────────────────────────────── │
│           │                                  │
│           │   ← Chỉ thiết kế phần này        │
│           │                                  │
└─────────────────────────────────────────────┘
```

**Gợi ý khi thiết kế:**
- Dùng màu sắc, font nhất quán với DESIGN.md của dự án (nếu có)
- Thiết kế cả trạng thái loading, empty state nếu cần
- Với bảng dữ liệu: thiết kế 1 màn hình đủ để AI hiểu cấu trúc, không cần thiết kế từng trạng thái

---

## Bước 2: Export code từ Stitch

1. Chọn screen trên canvas
2. Click icon `< >` (code icon) góc phải
3. Chọn **Tailwind CSS** hoặc **Vue**
4. Copy toàn bộ code

---

## Bước 3: Nhờ AI convert sang Vue

Tạo file mới trong `src/views/` rồi paste code Stitch vào, sau đó dùng prompt sau để nhờ AI xử lý.

### Prompt mẫu — trang thông thường

```
Tôi vừa paste code HTML/Tailwind export từ Google Stitch vào file này.
Hãy convert thành Vue 3 component (Composition API, <script setup>):

1. Thay data cứng bằng Vue reactive:
   - Text/số cố định → dùng ref() hoặc props
   - Danh sách lặp lại → dùng v-for với mảng ref()
   - Trạng thái hiện/ẩn → dùng v-if với ref boolean

2. Giữ nguyên toàn bộ Tailwind classes, không thay đổi style

3. Bọc toàn bộ nội dung trong <AdminLayout>:
   import AdminLayout from '@/components/layout/AdminLayout.vue'

4. Với các component UI (button, input, select, dialog):
   - Ưu tiên dùng lại component có sẵn trong src/components/ui/element-plus/
   - Danh sách: AppButton, AppInput, AppSelect, AppDialog, AppTable, AppForm, AppFormItem,
     AppPagination, AppCheckbox, AppRadio, AppSwitch, AppTabs, AppTag, AppDrawer
```

### Prompt mẫu — trang có bảng dữ liệu

```
Convert code Stitch này thành Vue 3 component có bảng dữ liệu:

1. Dùng AppTable từ src/components/ui/element-plus/AppTable.vue
2. Định nghĩa columns và tableData dạng ref([])
3. Thêm AppPagination ở cuối bảng
4. Nếu có checkbox chọn nhiều dòng: dùng @selection-change để track selectedRows
5. Bọc trong AdminLayout
6. Giữ nguyên Tailwind classes cho phần layout bên ngoài bảng
```

### Prompt mẫu — trang có form

```
Convert code Stitch này thành Vue 3 component có form:

1. Dùng AppForm + AppFormItem từ src/components/ui/element-plus/
2. Định nghĩa formData dạng reactive({})
3. Dùng AppInput, AppSelect, AppCheckbox... thay cho input HTML thuần
4. Thêm ref="formRef" và gọi formRef.value.validate() khi submit
5. Bọc trong AdminLayout
```

---

## Bước 4: Thêm route

Mở `src/router/index.ts` và thêm route mới:

```ts
{
  path: '/ten-trang',
  component: () => import('@/views/TenTrang.vue'),
}
```

---

## Ví dụ thực tế — Thiết kế lại Menu (Sidebar)

**Tình huống:** Muốn dùng Stitch thiết kế lại giao diện sidebar, sau đó AI convert.

**Lưu ý đặc biệt cho Sidebar:** Đây là component phức tạp hơn page thông thường vì có logic riêng. Dùng prompt sau:

```
Tôi vừa thiết kế lại giao diện AppSidebar trong Stitch và export ra HTML/Tailwind.
File gốc hiện tại ở src/components/layout/AppSidebar.vue.

Hãy:
1. Giữ nguyên toàn bộ logic Vue (menuGroups, isActive, toggleSubmenu, isSubmenuOpen,
   useSidebar composable, transition...)
2. Chỉ thay phần HTML template bằng thiết kế mới từ Stitch
3. Giữ nguyên các binding Vue: v-for, v-if, :class, @click, router-link, component :is
4. Giữ nguyên Tailwind classes nào liên quan đến responsive/dark mode nếu có
5. Không xóa bất kỳ logic nào trong <script setup>
```

---

## Checklist sau khi AI convert xong

- [ ] Chạy `npm run dev` và kiểm tra giao diện trên browser
- [ ] Kiểm tra dark mode (toggle ở header)
- [ ] Kiểm tra responsive (thu nhỏ cửa sổ)
- [ ] Với bảng: test chọn checkbox, phân trang
- [ ] Với form: test validation, submit
- [ ] Không có TypeScript error (`npm run type-check`)

---

## Cấu trúc file sau khi hoàn thành

```
src/
├── views/
│   └── TenTrang/
│       └── index.vue          ← file chính, dùng AdminLayout + code từ Stitch
├── components/
│   └── ui/
│       └── element-plus/      ← dùng lại, không tạo mới
└── router/
    └── index.ts               ← thêm route mới vào đây
```
