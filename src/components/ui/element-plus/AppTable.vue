<template>
  <div class="app-ui-table-wrapper" :class="customClass">
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :row-key="rowKey"
      :empty-text="emptyText"
      :max-height="maxHeight"
      :height="height"
      class="w-full"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
    >
      <slot />
      
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
      
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import type { TableInstance } from 'element-plus'

defineOptions({
  name: 'AppTable',
  inheritAttrs: false
})

type TableSize = 'large' | 'default' | 'small'

interface Props {
  data?: any[]
  border?: boolean
  stripe?: boolean
  size?: TableSize
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  rowKey?: string | ((row: any) => string)
  emptyText?: string
  maxHeight?: string | number
  height?: string | number
  loading?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  border: true,
  stripe: true,
  size: 'small',
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,
  rowKey: 'id',
  emptyText: 'Không có dữ liệu',
  maxHeight: undefined,
  height: undefined,
  loading: false,
  customClass: ''
})

const emit = defineEmits<{
  'select': [selection: any[], row: any]
  'select-all': [selection: any[]]
  'selection-change': [selection: any[]]
  'cell-click': [row: any, column: any, cell: any, event: Event]
  'row-click': [row: any, column: any, event: Event]
  'row-dblclick': [row: any, column: any, event: Event]
  'sort-change': [data: { column: any; prop: string; order: string }]
  'current-change': [currentRow: any, oldCurrentRow: any]
}>()

const tableRef = ref<TableInstance>()

const handleSelect = (selection: any[], row: any) => {
  emit('select', selection, row)
}

const handleSelectAll = (selection: any[]) => {
  emit('select-all', selection)
}

const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  emit('cell-click', row, column, cell, event)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowDblclick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleSortChange = (data: { column: any; prop: string; order: string }) => {
  emit('sort-change', data)
}

const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

// Expose methods
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

const toggleRowSelection = (row: any, selected?: boolean) => {
  tableRef.value?.toggleRowSelection(row, selected)
}

const toggleAllSelection = () => {
  tableRef.value?.toggleAllSelection()
}

const setCurrentRow = (row: any) => {
  tableRef.value?.setCurrentRow(row)
}

const clearSort = () => {
  tableRef.value?.clearSort()
}

const doLayout = () => {
  tableRef.value?.doLayout()
}

const sort = (prop: string, order: string) => {
  tableRef.value?.sort(prop, order)
}

defineExpose({
  tableRef,
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  clearSort,
  doLayout,
  sort
})
</script>

<style scoped>
.app-ui-table-wrapper {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppTable :data="tableData" :loading="isLoading">
  <el-table-column type="selection" width="55" />
  <el-table-column prop="name" label="Name" sortable />
  <el-table-column prop="email" label="Email" />
  <el-table-column prop="status" label="Status">
    <template #default="{ row }">
      <AppTag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status }}
      </AppTag>
    </template>
  </el-table-column>
  <el-table-column label="Actions" width="150">
    <template #default="{ row }">
      <AppButton size="small" @click="handleEdit(row)">Edit</AppButton>
      <AppButton size="small" variant="danger" @click="handleDelete(row)">Delete</AppButton>
    </template>
  </el-table-column>
</AppTable>

<AppTable 
  :data="users" 
  :loading="loading"
  highlight-current-row
  @row-click="handleRowClick"
  @selection-change="handleSelectionChange"
>
  ...columns
</AppTable>
-->
