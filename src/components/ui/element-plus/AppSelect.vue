<template>
  <el-select v-model="value" :placeholder="placeholder" style="width: 100%">
    <slot />
  </el-select>
</template>

<script setup lang="ts">
const value = defineModel<string>()

defineProps<{
  placeholder?: string
}>()
</script>
