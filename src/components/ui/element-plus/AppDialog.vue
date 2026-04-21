<template>
  <el-dialog
    v-bind="$attrs"
    v-model="modelValue"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :align-center="alignCenter"
    :draggable="draggable"
    :top="top"
    :header-class="headerClass"
    :footer-class="footerClass"
    :class="dialogClass"
    :style="{ '--sidebar-offset': `${sidebarOffset}px` }"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    
    <el-scrollbar :max-height="maxHeight" :always="alwaysShowScrollbar">
      <slot />
    </el-scrollbar>
    
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { useSidebar } from '@/composables/useSidebar'
import { computed, nextTick, watch } from 'vue'

defineOptions({
  name: 'AppDialog',
  inheritAttrs: false
})

interface Props {
  modelValue?: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  destroyOnClose?: boolean
  alignCenter?: boolean
  draggable?: boolean
  customClass?: string
  centerInContent?: boolean
  top?: string
  headerClass?: string
  footerClass?: string
  maxHeight?: string
  alwaysShowScrollbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: '50%',
  fullscreen: false,
  modal: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: true,
  alignCenter: true,
  draggable: false,
  customClass: '',
  centerInContent: true,
  top: '5vh',
  headerClass: '',
  footerClass: '',
  maxHeight: '70vh',
  alwaysShowScrollbar: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'opened': []
  'close': []
  'closed': []
}>()

const modelValue = defineModel<boolean>({ default: false })

const { isExpanded, isHovered } = useSidebar()

// Calculate the offset based on sidebar state
const sidebarOffset = computed(() => {
  if (!props.centerInContent) return 0
  // Sidebar is expanded when isExpanded or isHovered is true
  const sidebarWidth = (isExpanded.value || isHovered.value) ? 290 : 90
  return sidebarWidth / 2 // Half of sidebar width to center
})

// Calculate header offset (half of header height)
const headerOffset = computed(() => {
  if (!props.centerInContent) return 0
  // Header height is approximately 64px on desktop (py-4 = 16px * 2 + content ~32px)
  const headerHeight = 64
  return headerHeight / 2 // Half of header height to center
})

const dialogClass = computed(() => {
  return [
    'app-ui-dialog',
    props.centerInContent && 'app-ui-dialog-centered',
    props.customClass
  ]
})

// Apply offset to dialog element directly
const applyDialogOffset = () => {
  if (!props.centerInContent) return
  
  nextTick(() => {
    // Wait a bit for Element Plus to render the dialog in DOM
    setTimeout(() => {
      // Find all dialogs with our centered class
      const dialogs = document.querySelectorAll('.el-dialog.app-ui-dialog-centered')
      dialogs.forEach((dialog: Element) => {
        const htmlDialog = dialog as HTMLElement
        // Set CSS variables directly on the element
        htmlDialog.style.setProperty('--sidebar-offset', `${sidebarOffset.value}px`)
        htmlDialog.style.setProperty('--header-offset', `${headerOffset.value}px`)
      })
    }, 50) // Small delay to ensure DOM is ready
  })
}

// Watch sidebar state changes
watch([isExpanded, isHovered], () => {
  applyDialogOffset()
})

// Watch modelValue to apply offset when dialog opens
watch(modelValue, (newValue: boolean) => {
  if (newValue) {
    applyDialogOffset()
  }
})

const handleOpen = () => {
  applyDialogOffset()
  emit('open')
}

const handleOpened = () => {
  applyDialogOffset()
  emit('opened')
}

const handleClose = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}

</script>

<style>
/* Component-specific styles */
.app-ui-dialog {
  transition: all 0.2s;
}

/* Global centering styles are in main.css */
</style>

<!--
Usage Example:

Basic usage (with auto scroll using el-scrollbar):
<AppDialog v-model="dialogVisible" title="Edit User">
  <p>Dialog content here. Will auto-scroll if content exceeds max-height (70vh).</p>
  
  <template #footer>
    <AppButton @click="dialogVisible = false">Cancel</AppButton>
    <AppButton variant="primary" @click="handleSave">Save</AppButton>
  </template>
</AppDialog>

With custom max-height:
<AppDialog 
  v-model="dialogVisible" 
  title="Custom Height"
  maxHeight="85vh"
>
  <VeryLongContent />
</AppDialog>

Always show scrollbar:
<AppDialog 
  v-model="dialogVisible" 
  title="Always Scroll"
  :alwaysShowScrollbar="true"
>
  <Content />
</AppDialog>

With custom top position:
<AppDialog 
  v-model="dialogVisible" 
  title="Custom Position"
  top="10vh"
>
  <p>Dialog starts 10vh from top</p>
</AppDialog>

With draggable:
<AppDialog 
  v-model="confirmDialog" 
  title="Confirm Delete" 
  width="400px"
  draggable
>
  <p>Are you sure you want to delete this item?</p>
</AppDialog>

Props:
- maxHeight: Max height for el-scrollbar (default: '70vh')
- alwaysShowScrollbar: Always show scrollbar (default: false)
- top: Distance from viewport top (default: '5vh')
- headerClass: Custom class for dialog header
- footerClass: Custom class for dialog footer

Note: Uses native Element Plus el-scrollbar component for optimal performance
-->
