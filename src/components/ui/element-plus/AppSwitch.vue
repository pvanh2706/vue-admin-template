<template>
  <el-switch
    v-bind="$attrs"
    v-model="modelValue"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :inline-prompt="inlinePrompt"
    :class="['app-ui-switch', customClass]"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'

defineOptions({
  name: 'AppSwitch',
  inheritAttrs: false
})

type SwitchSize = 'large' | 'default' | 'small'

interface Props {
  modelValue?: boolean | string | number
  size?: SwitchSize
  disabled?: boolean
  loading?: boolean
  activeText?: string
  inactiveText?: string
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  inlinePrompt?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'small',
  disabled: false,
  loading: false,
  activeText: '',
  inactiveText: '',
  activeValue: true,
  inactiveValue: false,
  inlinePrompt: false,
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
.app-ui-switch {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppSwitch v-model="isActive" />

<AppSwitch 
  v-model="status" 
  active-text="ON" 
  inactive-text="OFF"
  inline-prompt
/>

<AppSwitch 
  v-model="mode" 
  active-value="enabled" 
  inactive-value="disabled"
/>
-->
