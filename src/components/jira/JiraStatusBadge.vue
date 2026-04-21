<template>
  <el-tag :type="tagType" :size="size">
    <component :is="iconComponent" class="mr-1" style="width: 14px; height: 14px" />
    {{ statusText }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, InfoIcon, RefreshIcon, ErrorIcon } from '@/icons'

interface Props {
  status: 'connected' | 'disconnected' | 'testing' | 'error'
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
})

const tagType = computed(() => {
  switch (props.status) {
    case 'connected':
      return 'success'
    case 'disconnected':
      return 'info'
    case 'testing':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
})

const iconComponent = computed(() => {
  switch (props.status) {
    case 'connected':
      return CheckIcon
    case 'disconnected':
      return InfoIcon
    case 'testing':
      return RefreshIcon
    case 'error':
      return ErrorIcon
    default:
      return InfoIcon
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'connected':
      return 'Connected'
    case 'disconnected':
      return 'Not Connected'
    case 'testing':
      return 'Testing...'
    case 'error':
      return 'Error'
    default:
      return 'Unknown'
  }
})
</script>
