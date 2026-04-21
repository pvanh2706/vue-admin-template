<template>
  <el-pagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    background
    @change="emit('change', { page: page, pageSize: pageSize })"
  />
</template>

<script setup lang="ts">
const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })

defineProps<{ total: number }>()

const emit = defineEmits<{
  (e: 'change', value: { page: number; pageSize: number }): void
}>()
</script>
