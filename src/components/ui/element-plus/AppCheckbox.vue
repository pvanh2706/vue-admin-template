<template>
  <el-checkbox
    v-bind="$attrs"
    v-model="modelValue"
    :size="size"
    :disabled="disabled"
    :indeterminate="indeterminate"
    :border="border"
    :class="['app-ui-checkbox', customClass]"
    @change="handleChange"
  >
    <slot />
  </el-checkbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'

defineOptions({
  name: 'AppCheckbox',
  inheritAttrs: false
})

type CheckboxSize = 'large' | 'default' | 'small'

interface Props {
  modelValue?: boolean | string | number
  size?: CheckboxSize
  disabled?: boolean
  indeterminate?: boolean
  border?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'small',
  disabled: false,
  indeterminate: false,
  border: false,
  customClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
  'change': [value: boolean | string | number]
}>()

const modelValue = defineModel<boolean | string | number>({ default: false })

const handleChange = (value: boolean | string | number) => {
  emit('change', value)
}
</script>

<style scoped>
.app-ui-checkbox {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppCheckbox v-model="checked">
  Remember me
</AppCheckbox>

<AppCheckbox v-model="agreed" border>
  I agree to terms
</AppCheckbox>

<el-checkbox-group v-model="checkedList">
  <AppCheckbox label="Option A" />
  <AppCheckbox label="Option B" />
</el-checkbox-group>
-->
