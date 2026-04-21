<template>
  <el-select
    v-bind="$attrs"
    v-model="model"
    :size="size"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :placeholder="placeholder"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :class="['app-ui-select w-full', customClass]"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @remove-tag="handleRemoveTag"
    @clear="handleClear"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot />
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus'

defineOptions({
  name: 'AppSelect',
  inheritAttrs: false
})

type SelectSize = 'large' | 'default' | 'small'

interface Props {
  size?: SelectSize
  clearable?: boolean
  filterable?: boolean
  disabled?: boolean
  placeholder?: string
  multiple?: boolean
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  clearable: false,
  filterable: false,
  disabled: false,
  placeholder: 'Chọn...',
  multiple: false,
  collapseTags: false,
  collapseTagsTooltip: false,
  customClass: ''
})

const emit = defineEmits<{
  'change': [value: any]
  'visible-change': [visible: boolean]
  'remove-tag': [tagValue: any]
  'clear': []
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const model = defineModel<any>()

const handleChange = (value: any) => {
  emit('change', value)
}

const handleVisibleChange = (visible: boolean) => {
  emit('visible-change', visible)
}

const handleRemoveTag = (tagValue: any) => {
  emit('remove-tag', tagValue)
}

const handleClear = () => {
  emit('clear')
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.app-ui-select {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppSelect v-model="selectedValue" placeholder="Select option">
  <el-option label="Option 1" value="1" />
  <el-option label="Option 2" value="2" />
</AppSelect>

<AppSelect v-model="selectedValues" multiple placeholder="Select multiple">
  <el-option 
    v-for="item in options" 
    :key="item.value" 
    :label="item.label" 
    :value="item.value" 
  />
</AppSelect>
-->
