<template>
  <el-tag
    v-bind="$attrs"
    :type="type"
    :size="size"
    :effect="effect"
    :closable="closable"
    :disable-transitions="disableTransitions"
    :hit="hit"
    :round="round"
    :class="['app-ui-tag', customClass]"
    @close="handleClose"
    @click="handleClick"
  >
    <slot />
  </el-tag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'

defineOptions({
  name: 'AppTag',
  inheritAttrs: false
})

type TagType = '' | 'success' | 'info' | 'warning' | 'danger'
type TagSize = 'large' | 'default' | 'small'
type TagEffect = 'dark' | 'light' | 'plain'

interface Props {
  type?: TagType
  size?: TagSize
  effect?: TagEffect
  closable?: boolean
  disableTransitions?: boolean
  hit?: boolean
  round?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  size: 'small',
  effect: 'light',
  closable: false,
  disableTransitions: false,
  hit: false,
  round: false,
  customClass: ''
})

const emit = defineEmits<{
  'close': [event: Event]
  'click': [event: Event]
}>()

const handleClose = (event: Event) => {
  emit('close', event)
}

const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<style scoped>
.app-ui-tag {
  @apply transition-all duration-200;
}
</style>

<!--
Usage Example:

<AppTag>Default</AppTag>
<AppTag type="success">Success</AppTag>
<AppTag type="info">Info</AppTag>
<AppTag type="warning">Warning</AppTag>
<AppTag type="danger">Danger</AppTag>

<AppTag type="success" effect="dark">Dark Effect</AppTag>
<AppTag type="warning" effect="plain">Plain Effect</AppTag>

<AppTag closable @close="handleClose">Closable Tag</AppTag>

<AppTag type="success" round>Rounded Tag</AppTag>

<AppTag 
  v-for="tag in tags" 
  :key="tag.id"
  :type="tag.type"
  closable
  @close="removeTag(tag)"
>
  {{ tag.name }}
</AppTag>
-->
