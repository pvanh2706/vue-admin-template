<template>
  <div class="jira-project-settings mt-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Jira Projects</h3>
      <el-button type="primary" @click="handleFetchProjects" :loading="loading">
        {{ projects.length > 0 ? 'Refresh Projects' : 'Fetch Projects' }}
      </el-button>
    </div>

    <div v-if="projects.length === 0" class="text-center text-gray-400 py-8">
      <p>No projects loaded yet. Click "Fetch Projects" to load available Jira projects.</p>
    </div>

    <div v-else>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          Default Project
        </label>
        <JiraProjectSelector
          :projects="projects"
          :model-value="config?.defaultProjectKey || null"
          @update:model-value="handleSetDefaultProject"
          placeholder="Select default project"
        />
        <span class="text-sm text-gray-500 mt-1 block">
          This project will be used as the default for new tasks
        </span>
      </div>

      <el-table :data="projects" border style="width: 100%">
        <el-table-column prop="key" label="Key" width="120">
          <template #default="{ row }">
            <span class="font-medium">{{ row.key }}</span>
            <el-tag v-if="row.key === config?.defaultProjectKey" type="success" size="small" class="ml-2">
              Default
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="projectTypeKey" label="Type" width="120" />
        <el-table-column prop="lead.displayName" label="Lead" width="180" />
        <el-table-column label="Avatar" width="80">
          <template #default="{ row }">
            <img v-if="row.avatarUrl" :src="row.avatarUrl" class="w-8 h-8 rounded" />
          </template>
        </el-table-column>
      </el-table>

      <div v-if="metadata" class="mt-6">
        <h4 class="text-md font-semibold mb-3 text-gray-800 dark:text-white/90">Jira Metadata</h4>
        
        <el-collapse>
          <el-collapse-item title="Issue Types" name="issueTypes">
            <div class="flex flex-wrap gap-2">
              <el-tag v-for="type in metadata.issueTypes" :key="type.id">
                <img :src="type.iconUrl" class="w-4 h-4 inline mr-1" />
                {{ type.name }}
              </el-tag>
            </div>
          </el-collapse-item>

          <el-collapse-item title="Priorities" name="priorities">
            <div class="flex flex-wrap gap-2">
              <el-tag v-for="priority in metadata.priorities" :key="priority.id">
                <img :src="priority.iconUrl" class="w-4 h-4 inline mr-1" />
                {{ priority.name }}
              </el-tag>
            </div>
          </el-collapse-item>

          <el-collapse-item title="Statuses" name="statuses">
            <div class="flex flex-wrap gap-2">
              <el-tag
                v-for="status in metadata.statuses"
                :key="status.id"
                :type="getStatusType(status.statusCategory.key)"
              >
                {{ status.name }}
              </el-tag>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJiraConfigState } from '@/composables/jira/useJiraConfigState'
import { useJiraProjects } from '@/composables/jira/useJiraProjects'
import JiraProjectSelector from '@/components/jira/JiraProjectSelector.vue'

const { config, loading, projects, metadata } = useJiraConfigState()
const { fetchProjects, setDefaultProject } = useJiraProjects()

async function handleFetchProjects() {
  await fetchProjects()
}

async function handleSetDefaultProject(projectKey: string | null) {
  if (!projectKey) return
  await setDefaultProject(projectKey)
}

function getStatusType(categoryKey: string): 'success' | 'warning' | 'info' | 'danger' {
  switch (categoryKey) {
    case 'done':
      return 'success'
    case 'indeterminate':
      return 'warning'
    case 'new':
      return 'info'
    default:
      return 'info'
  }
}
</script>
