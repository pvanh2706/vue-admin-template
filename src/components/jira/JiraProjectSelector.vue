<template>
  <el-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :placeholder="placeholder"
    :disabled="disabled"
    filterable
    clearable
    class="w-full"
  >
    <el-option
      v-for="project in projects"
      :key="project.key"
      :label="`${project.key} - ${project.name}`"
      :value="project.key"
    >
      <div class="flex items-center">
        <img v-if="project.avatarUrl" :src="project.avatarUrl" class="w-5 h-5 mr-2 rounded" />
        <span class="font-medium">{{ project.key }}</span>
        <span class="ml-2 text-gray-500">{{ project.name }}</span>
      </div>
    </el-option>
    <template #empty>
      <div class="text-center text-gray-400 py-2">No projects available</div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import type { JiraProject } from '@/types/jira/config'

interface Props {
  projects: JiraProject[]
  modelValue: string | null
  disabled?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: 'Select a project',
})

defineEmits<Emits>()
</script>
