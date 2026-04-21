<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :draggable="draggable"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })

defineProps<{
  title?: string
  width?: number | string
  draggable?: boolean
}>()
</script>
