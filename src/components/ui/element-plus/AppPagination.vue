<template>
  <div class="app-ui-pagination-wrapper" :class="[wrapperClass, customClass]">
    <el-pagination
      v-bind="$attrs"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      :background="background"
      :disabled="disabled"
      :hide-on-single-page="hideOnSinglePage"
      :small="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElPagination } from 'element-plus'

defineOptions({
  name: 'AppPagination',
  inheritAttrs: false
})

interface Props {
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
  total?: number
  background?: boolean
  disabled?: boolean
  hideOnSinglePage?: boolean
  small?: boolean
  align?: 'left' | 'center' | 'right'
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  total: 0,
  background: true,
  disabled: false,
  hideOnSinglePage: false,
  small: false,
  align: 'right',
  customClass: ''
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'size-change': [size: number]
  'current-change': [page: number]
  'change': [page: number, size: number]
}>()

const currentPage = defineModel<number>('currentPage', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const wrapperClass = computed(() => {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }
  return `flex ${alignMap[props.align]}`
})

const handleSizeChange = (size: number) => {
  emit('size-change', size)
  emit('change', currentPage.value, size)
}

const handleCurrentChange = (page: number) => {
  emit('current-change', page)
  emit('change', page, pageSize.value)
}
</script>

<style scoped>
.app-ui-pagination-wrapper {
  @apply py-4 transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppPagination
  v-model:current-page="pagination.page"
  v-model:page-size="pagination.size"
  :total="pagination.total"
  @change="fetchData"
/>

<AppPagination
  v-model:current-page="page"
  v-model:page-size="pageSize"
  :total="total"
  :page-sizes="[5, 10, 25, 50]"
  align="center"
  @size-change="handleSizeChange"
  @current-change="handlePageChange"
/>

<script setup>
const pagination = ref({
  page: 1,
  size: 10,
  total: 100
})

const fetchData = (page, size) => {
  // Fetch data with new pagination
}
</script>
-->
