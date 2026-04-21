<template>
  <el-button :type="elType" v-bind="$attrs">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: string
}>()

const elType = computed(() => {
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'danger') return 'danger'
  return ''
})
</script>
