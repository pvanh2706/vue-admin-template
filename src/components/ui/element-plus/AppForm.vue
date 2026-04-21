<template>
  <el-form
    ref="formRef"
    v-bind="$attrs"
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :label-suffix="labelSuffix"
    :size="size"
    :disabled="disabled"
    :inline="inline"
    :show-message="showMessage"
    :status-icon="statusIcon"
    :scroll-to-error="scrollToError"
    :class="['app-ui-form', customClass]"
    @validate="handleValidate"
  >
    <slot />
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElForm } from 'element-plus'
import type { FormInstance, FormRules, FormValidateCallback } from 'element-plus'

defineOptions({
  name: 'AppForm',
  inheritAttrs: false
})

type FormSize = 'large' | 'default' | 'small'
type LabelPosition = 'left' | 'right' | 'top'

interface Props {
  model?: Record<string, any>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: LabelPosition
  labelSuffix?: string
  size?: FormSize
  disabled?: boolean
  inline?: boolean
  showMessage?: boolean
  statusIcon?: boolean
  scrollToError?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  rules: () => ({}),
  labelWidth: 'auto',
  labelPosition: 'top',
  labelSuffix: '',
  size: 'small',
  disabled: false,
  inline: false,
  showMessage: true,
  statusIcon: false,
  scrollToError: true,
  customClass: ''
})

const emit = defineEmits<{
  'validate': [prop: string, isValid: boolean, message: string]
}>()

const formRef = ref<FormInstance>()

const handleValidate = (prop: string, isValid: boolean, message: string) => {
  emit('validate', prop, isValid, message)
}

// Expose methods
const validate = async (callback?: FormValidateCallback) => {
  return formRef.value?.validate(callback)
}

const validateField = async (props?: string | string[]) => {
  return formRef.value?.validateField(props)
}

const resetFields = (props?: string | string[]) => {
  formRef.value?.resetFields(props)
}

const clearValidate = (props?: string | string[]) => {
  formRef.value?.clearValidate(props)
}

const scrollToField = (prop: string) => {
  formRef.value?.scrollToField(prop)
}

defineExpose({
  formRef,
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField
})
</script>

<style scoped>
.app-ui-form {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppForm ref="formRef" :model="formData" :rules="rules">
  <AppFormItem label="Username" prop="username">
    <AppInput v-model="formData.username" />
  </AppFormItem>
  
  <AppFormItem label="Email" prop="email">
    <AppInput v-model="formData.email" type="email" />
  </AppFormItem>
  
  <AppFormItem>
    <AppButton variant="primary" @click="handleSubmit">Submit</AppButton>
  </AppFormItem>
</AppForm>

<script setup>
const formRef = ref()
const formData = ref({ username: '', email: '' })

const rules = {
  username: [{ required: true, message: 'Username is required' }],
  email: [{ required: true, type: 'email', message: 'Valid email required' }]
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    // Submit form
  }
}
</script>
-->
