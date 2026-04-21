<template>
  <el-radio
    v-bind="$attrs"
    v-model="modelValue"
    :size="size"
    :disabled="disabled"
    :border="border"
    :value="value"
    :class="['app-ui-radio', customClass]"
    @change="handleChange"
  >
    <slot />
  </el-radio>
</template>

<script setup lang="ts">
import { ElRadio } from 'element-plus'

defineOptions({
  name: 'AppRadio',
  inheritAttrs: false
})

type RadioSize = 'large' | 'default' | 'small'

interface Props {
  modelValue?: string | number | boolean
  value?: string | number | boolean
  size?: RadioSize
  disabled?: boolean
  border?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  value: '',
  size: 'small',
  disabled: false,
  border: false,
  customClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'change': [value: string | number | boolean]
}>()

const modelValue = defineModel<string | number | boolean>({ default: '' })

const handleChange = (value: string | number | boolean) => {
  emit('change', value)
}
</script>

<style scoped>
.app-ui-radio {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<el-radio-group v-model="selected">
  <AppRadio value="1">Option 1</AppRadio>
  <AppRadio value="2">Option 2</AppRadio>
  <AppRadio value="3" disabled>Option 3</AppRadio>
</el-radio-group>

<el-radio-group v-model="selected">
  <AppRadio value="a" border>Choice A</AppRadio>
  <AppRadio value="b" border>Choice B</AppRadio>
</el-radio-group>
-->
