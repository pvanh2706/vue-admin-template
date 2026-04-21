<template>
  <el-tabs
    v-bind="$attrs"
    v-model="modelValue"
    :type="type"
    :tab-position="tabPosition"
    :stretch="stretch"
    :class="['app-ui-tabs', customClass]"
    @tab-click="handleTabClick"
    @tab-change="handleTabChange"
    @tab-remove="handleTabRemove"
    @tab-add="handleTabAdd"
  >
    <slot />
  </el-tabs>
</template>

<script setup lang="ts">
import { ElTabs } from 'element-plus'
import type { TabsPaneContext, TabPaneName } from 'element-plus'

defineOptions({
  name: 'AppTabs',
  inheritAttrs: false
})

type TabsType = '' | 'card' | 'border-card'
type TabPosition = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  modelValue?: TabPaneName
  type?: TabsType
  tabPosition?: TabPosition
  stretch?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: '',
  tabPosition: 'top',
  stretch: false,
  customClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: TabPaneName]
  'tab-click': [pane: TabsPaneContext, ev: Event]
  'tab-change': [name: TabPaneName]
  'tab-remove': [name: TabPaneName]
  'tab-add': []
}>()

const modelValue = defineModel<TabPaneName>({ default: '' })

const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
  emit('tab-click', pane, ev)
}

const handleTabChange = (name: TabPaneName) => {
  emit('tab-change', name)
}

const handleTabRemove = (name: TabPaneName) => {
  emit('tab-remove', name)
}

const handleTabAdd = () => {
  emit('tab-add')
}
</script>

<style scoped>
.app-ui-tabs {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppTabs v-model="activeTab">
  <el-tab-pane label="User" name="user">User content</el-tab-pane>
  <el-tab-pane label="Config" name="config">Config content</el-tab-pane>
  <el-tab-pane label="Role" name="role">Role content</el-tab-pane>
</AppTabs>

<AppTabs v-model="activeTab" type="card" tab-position="left">
  <el-tab-pane label="Dashboard" name="dashboard">
    Dashboard content
  </el-tab-pane>
  <el-tab-pane label="Analytics" name="analytics">
    Analytics content
  </el-tab-pane>
</AppTabs>

<AppTabs 
  v-model="activeTab" 
  type="border-card"
  @tab-click="handleTabClick"
  @tab-change="handleTabChange"
>
  ...tabs
</AppTabs>
-->
