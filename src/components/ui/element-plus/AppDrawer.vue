<template>
  <el-drawer
    v-bind="$attrs"
    v-model="modelValue"
    :title="title"
    :direction="direction"
    :size="size"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :with-header="withHeader"
    :class="['app-ui-drawer', customClass]"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    
    <slot />
    
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElDrawer } from 'element-plus'

defineOptions({
  name: 'AppDrawer',
  inheritAttrs: false
})

type DrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'

interface Props {
  modelValue?: boolean
  title?: string
  direction?: DrawerDirection
  size?: string | number
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  destroyOnClose?: boolean
  withHeader?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  direction: 'rtl',
  size: '30%',
  modal: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: true,
  withHeader: true,
  customClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'opened': []
  'close': []
  'closed': []
}>()

const modelValue = defineModel<boolean>({ default: false })

const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
}

const handleClose = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}
</script>

<style scoped>
.app-ui-drawer {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppDrawer v-model="drawerVisible" title="User Details">
  <div class="p-4">
    <p>Drawer content here</p>
  </div>
  
  <template #footer>
    <div class="flex justify-end gap-2">
      <AppButton @click="drawerVisible = false">Cancel</AppButton>
      <AppButton variant="primary" @click="handleSave">Save</AppButton>
    </div>
  </template>
</AppDrawer>

<AppDrawer 
  v-model="filterDrawer" 
  title="Filters" 
  direction="ltr"
  size="400px"
>
  <div class="p-4">Filter options</div>
</AppDrawer>
-->
