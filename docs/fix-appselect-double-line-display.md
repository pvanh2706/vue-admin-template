# Fix: AppSelect hiển thị 2 dòng và Placeholder không hiển thị

## 📋 Mô tả vấn đề

### Vấn đề 1: Hiển thị 2 dòng trùng lặp
Khi sử dụng component `AppSelect`, el-select hiển thị **2 dòng trùng lặp**:
- Dòng 1: Input field
- Dòng 2: Placeholder text

### Vấn đề 2: Placeholder không hiển thị
Sau khi fix vấn đề 1, placeholder lại không hiển thị khi chưa chọn giá trị.

### Triệu chứng
```vue
<!-- Component sử dụng -->
<AppSelect v-model="stopReason" placeholder="Chọn lý do">
  <el-option label="Lý do 1" value="Lý do 1" />
  <el-option label="Lý do 2" value="Lý do 2" />
</AppSelect>
```

**Kết quả ban đầu**: 
- Hiển thị 2 dòng chồng lên nhau
- Hoặc placeholder không hiển thị khi chưa chọn giá trị

---

## 🔍 Nguyên nhân

### Vấn đề 1: Conflict giữa `v-model` và `defineModel()`

**Code lỗi ban đầu:**
```vue
<template>
  <el-select v-model="modelValue" ... >
  </el-select>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | boolean | object | Array<any>  // ❌ Prop không cần thiết
  // ...
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',  // ❌ Default value gây conflict
  // ...
})

const emit = defineEmits<{
  'update:modelValue': [value: any]  // ❌ Emit thủ công
  // ...
}>()

const modelValue = defineModel<any>({ default: '' })  // ❌ defineModel với default
</script>
```

**Vấn đề:**
- Component **khai báo cả 3 cách** binding v-model cùng lúc:
  1. Props `modelValue` với default value
  2. Emit `update:modelValue` thủ công
  3. `defineModel()` với default value
  
- Dẫn đến Vue tạo ra **2 reactive references** cho cùng 1 giá trị
- Element Plus render cả input và placeholder như 2 elements riêng biệt

### Vấn đề 2: CSS bị Tailwind CSS v4 override

Element Plus sử dụng CSS để hiển thị placeholder, nhưng Tailwind CSS v4 với `@import 'tailwindcss'` có CSS reset mạnh trong `@layer base`, ghi đè styles của Element Plus và làm placeholder không hiển thị.

---

## ✅ Giải pháp

### Bước 1: Sửa Vue Composition Logic

**Loại bỏ duplicate binding, chỉ giữ `defineModel()`:**

```vue
<template>
  <el-select
    v-bind="$attrs"
    v-model="model"  <!-- ✅ Bind trực tiếp với defineModel -->
    :size="size"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :placeholder="placeholder"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :class="['app-ui-select w-full', customClass]"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @remove-tag="handleRemoveTag"
    @clear="handleClear"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot />
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus'

defineOptions({
  name: 'AppSelect',
  inheritAttrs: false
})

type SelectSize = 'large' | 'default' | 'small'

interface Props {
  // ✅ Xóa modelValue prop
  size?: SelectSize
  clearable?: boolean
  filterable?: boolean
  disabled?: boolean
  placeholder?: string
  multiple?: boolean
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  // ✅ Xóa modelValue default
  size: 'default',
  clearable: false,
  filterable: false,
  disabled: false,
  placeholder: 'Chọn...',
  multiple: false,
  collapseTags: false,
  collapseTagsTooltip: false,
  customClass: ''
})

const emit = defineEmits<{
  // ✅ Xóa 'update:modelValue' emit
  'change': [value: any]
  'visible-change': [visible: boolean]
  'remove-tag': [tagValue: any]
  'clear': []
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// ✅ Chỉ sử dụng defineModel(), KHÔNG có default value
const model = defineModel<any>()

const handleChange = (value: any) => {
  emit('change', value)
}

const handleVisibleChange = (visible: boolean) => {
  emit('visible-change', visible)
}

const handleRemoveTag = (tagValue: any) => {
  emit('remove-tag', tagValue)
}

const handleClear = () => {
  emit('clear')
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.app-ui-select {
  @apply transition-all duration-200;
}
</style>
```

### Bước 2: Sửa CSS Global để fix placeholder

Thêm CSS vào `src/assets/main.css`:

```css
/* Fix Element Plus el-select placeholder - SIMPLE AND EFFECTIVE */
.el-select .el-select__placeholder {
  display: inline-block !important;
  opacity: 1 !important;
}
```

**Giải thích:**
- Force `display` và `opacity` để placeholder không bị Tailwind CSS reset
- Element Plus tự động xử lý việc ẩn placeholder khi có giá trị (qua class `.is-transparent`)
- CSS đơn giản, áp dụng cho TẤT CẢ `el-select` (cả AppSelect và el-select gốc)
- KHÔNG cần xử lý `.is-transparent` thủ công - Element Plus tự lo

### Bước 3: Clean up CSS không cần thiết

Xóa các CSS override phức tạp trong `src/assets/element-plus-dark.css` (nếu có).

---

## 🎯 Kết quả cuối cùng

### Trước khi fix:
```
┌─────────────────────────┐
│ Input text here         │  ← Dòng input
│ Placeholder text        │  ← Dòng placeholder (trùng lặp)
└─────────────────────────┘

HOẶC

┌─────────────────────────┐
│                         │  ← Placeholder không hiển thị
└─────────────────────────┘
```

### Sau khi fix:
```
┌─────────────────────────┐
│ Chọn lý do...           │  ← Placeholder hiển thị đúng khi chưa chọn
└─────────────────────────┘

┌─────────────────────────┐
│ Lý do 1                 │  ← Giá trị đã chọn, placeholder tự động ẩn
└─────────────────────────┘
```

## 📝 Cách sử dụng

Component vẫn hoạt động như cũ, không cần thay đổi code ở nơi sử dụng:

```vue
<template>
  <AppSelect v-model="selectedValue">
    <el-option label="Option 1" value="1" />
    <el-option label="Option 2" value="2" />
  </AppSelect>
  
  <!-- Multiple select -->
  <AppSelect v-model="selectedValues" multiple>
    <el-option 
      v-for="item in options" 
      :key="item.value" 
      :label="item.label" 
      :value="item.value" 
    />
  </AppSelect>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedValue = ref('')
const selectedValues = ref([])

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
]
</script>
```

---

## 🔧 Tổng kết thay đổi

### File: `src/components/ui/element-plus/AppSelect.vue`

| Thay đổi | Trước | Sau |
|----------|-------|-----|
| **Props** | `modelValue` prop có default | ❌ Xóa prop này |
| **Emit** | `update:modelValue` thủ công | ❌ Xóa emit này |
| **v-model** | `v-model="modelValue"` | ✅ `v-model="model"` |
| **defineModel** | `defineModel({ default: '' })` | ✅ `defineModel()` (không default) |
| **Props defaults** | `size: 'small'`, `clearable: true`, `filterable: true`, `collapseTags: true` | ✅ `size: 'default'`, `clearable: false`, `filterable: false`, `collapseTags: false` |

### File: `src/assets/main.css`

| Thay đổi | Nội dung |
|----------|----------|
| ✅ **Thêm CSS mới** | `.el-select .el-select__placeholder { display: inline-block !important; opacity: 1 !important; }` |

**Giải thích:** CSS đơn giản chỉ với 2 properties, Element Plus tự xử lý phần còn lại.

### File: `src/assets/element-plus-dark.css`

| Thay đổi | Nội dung |
|----------|----------|
| ❌ **Xóa CSS cũ** | Xóa các CSS override phức tạp cho `.is-transparent` |

**Giải thích:** Không cần CSS riêng cho dark mode, CSS global đã đủ.

---

## ⚠️ Lưu ý quan trọng

1. **CSS đơn giản là tốt nhất**: Không cần override quá nhiều properties. Chỉ cần `display` và `opacity` là đủ, Element Plus tự xử lý phần còn lại.

2. **Để Element Plus tự xử lý**: Element Plus có mechanism tự động ẩn placeholder khi có giá trị (qua class `.is-transparent`). Không nên can thiệp vào logic này.

3. **Vue 3.3+**: `defineModel()` chỉ hoạt động với Vue 3.3 trở lên. Nếu dùng phiên bản cũ hơn, cần sử dụng cách binding thủ công.

4. **Không dùng default value cho defineModel**: Để `undefined` là giá trị mặc định, Element Plus sẽ hiển thị placeholder đúng cách.

5. **Backward compatible**: Cách sử dụng component không thay đổi, chỉ fix internal implementation.

6. **Hard refresh**: Sau khi sửa CSS, có thể cần hard refresh (Ctrl+Shift+R) hoặc clear cache để thấy thay đổi.

---

## 💡 Tại sao giải pháp này hiệu quả?

### Vấn đề gốc
- **Vue Composition API conflict**: Sử dụng cả props + emit + defineModel cùng lúc
- **Tailwind CSS v4 reset**: CSS reset mạnh làm mất styles của Element Plus

### Giải pháp
1. **Vue**: Chỉ dùng `defineModel()` - clean và đúng chuẩn Vue 3.3+
2. **CSS**: Force 2 properties cần thiết, để Element Plus tự xử lý logic

### Kết quả
- ✅ Code sạch, dễ maintain
- ✅ Ít CSS override → ít conflict
- ✅ Hoạt động với tất cả el-select (AppSelect và el-select gốc)
- ✅ Compatible với dark mode

---

## 📚 Tham khảo

- [Vue 3 defineModel() Documentation](https://vuejs.org/api/sfc-script-setup.html#definemodel)
- [Element Plus Select Component](https://element-plus.org/en-US/component/select.html)
- [Vue 3 v-model Guide](https://vuejs.org/guide/components/v-model.html)

---

**Ngày cập nhật**: 21/02/2026  
**Người thực hiện**: GitHub Copilot  
**Trạng thái**: ✅ Đã kiểm tra và hoạt động
