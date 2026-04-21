<template>
  <el-button
    v-bind="$attrs"
    :type="mappedType"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :class="['app-ui-button', customClass]"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton } from 'element-plus'

defineOptions({
  name: 'AppButton',
  inheritAttrs: false
})

type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
type ButtonSize = 'large' | 'default' | 'small'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  customClass: ''
})

// Map variant to Element Plus type
const mappedType = computed(() => {
  const variantMap: Record<ButtonVariant, string> = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    default: 'default'
  }
  return variantMap[props.variant] || 'default'
})
</script>

<style scoped>
.app-ui-button {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppButton variant="primary" @click="handleClick">
  Submit
</AppButton>

<AppButton variant="danger" loading>
  Deleting...
</AppButton>

<AppButton variant="success" size="large">
  <template #default>
    <span class="flex items-center gap-2">
      <IconCheck /> Save
    </span>
  </template>
</AppButton>
-->
