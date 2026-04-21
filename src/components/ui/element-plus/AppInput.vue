<template>
  <el-input
    v-model="value"
    :type="type"
    :placeholder="placeholder"
    :clearable="clearable"
  />
</template>

<script setup lang="ts">
const value = defineModel<string>()

defineProps<{
  type?: string
  placeholder?: string
  clearable?: boolean
}>()
</script>
