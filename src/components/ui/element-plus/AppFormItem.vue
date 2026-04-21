<template>
  <el-form-item
    v-bind="$attrs"
    :label="label"
    :prop="prop"
    :label-width="labelWidth"
    :required="required"
    :rules="rules"
    :error="error"
    :show-message="showMessage"
    :size="size"
    :class="['app-ui-form-item', customClass]"
  >
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    
    <slot />
    
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import { ElFormItem } from 'element-plus'
import type { FormItemRule } from 'element-plus'

defineOptions({
  name: 'AppFormItem',
  inheritAttrs: false
})

type FormItemSize = 'large' | 'default' | 'small'

interface Props {
  label?: string
  prop?: string
  labelWidth?: string | number
  required?: boolean
  rules?: FormItemRule | FormItemRule[]
  error?: string
  showMessage?: boolean
  size?: FormItemSize
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  prop: '',
  labelWidth: '',
  required: false,
  rules: undefined,
  error: '',
  showMessage: true,
  size: 'small',
  customClass: ''
})
</script>

<style scoped>
.app-ui-form-item {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppFormItem label="Username" prop="username" required>
  <AppInput v-model="form.username" />
</AppFormItem>

<AppFormItem prop="email" :rules="emailRules">
  <template #label>
    <span class="flex items-center gap-1">
      <IconMail /> Email
    </span>
  </template>
  <AppInput v-model="form.email" type="email" />
</AppFormItem>

<AppFormItem label="Password" prop="password" :rules="passwordRules">
  <AppInput v-model="form.password" type="password" />
  <template #error="{ error }">
    <span class="text-red-500 text-xs">{{ error }}</span>
  </template>
</AppFormItem>
-->
