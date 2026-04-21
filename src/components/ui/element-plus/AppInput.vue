<template>
  <el-input
    v-bind="$attrs"
    v-model="modelValue"
    :size="size"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :class="['app-ui-input w-full', customClass]"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @clear="handleClear"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'

defineOptions({
  name: 'AppInput',
  inheritAttrs: false
})

type InputSize = 'large' | 'default' | 'small'
type InputType = 'text' | 'textarea' | 'password' | 'number'

interface Props {
  modelValue?: string | number
  size?: InputSize
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  type?: InputType
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 'default',
  clearable: true,
  disabled: false,
  placeholder: '',
  type: 'text',
  customClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'input': [value: string | number]
  'change': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}>()

const modelValue = defineModel<string | number>({ default: '' })

const handleInput = (value: string | number) => {
  emit('input', value)
}

const handleChange = (value: string | number) => {
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleClear = () => {
  emit('clear')
}
</script>

<style scoped>
.app-ui-input {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppInput v-model="username" placeholder="Enter username" />

<AppInput v-model="search" placeholder="Search...">
  <template #prefix>
    <IconSearch />
  </template>
</AppInput>

<AppInput 
  v-model="password" 
  type="password" 
  placeholder="Enter password"
  :clearable="false"
/>
-->
