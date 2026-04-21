import { computed } from 'vue'
import { ElNotification } from 'element-plus'
import { useJiraConfigState } from './useJiraConfigState'
import { jiraConfigApi } from '@/services/jira/config-api'
import { isSuccess } from '@/types/common'
import type { JiraProject } from '@/types/jira/config'

/**
 * Composable for Jira project operations
 * Handles fetching projects and setting default project
 */
export function useJiraProjects() {
  const { config, loading, error, projects, metadata } = useJiraConfigState()

  /**
   * Fetch available projects from Jira
   */
  async function fetchProjects(): Promise<boolean> {
    if (!config.value) {
      ElNotification.warning({ title: 'Warning', message: 'No Jira configuration found' })
      return false
    }

    loading.value = true

    const result = await jiraConfigApi.fetchProjects()

    loading.value = false

    if (isSuccess(result)) {
      projects.value = result.data.projects
      metadata.value = result.data.metadata
      ElNotification.success({
        title: 'Success',
        message: `Fetched ${result.data.projects.length} projects`,
      })
      return true
    } else {
      error.value = result.error
      ElNotification.error({ title: 'Error', message: result.error })
      return false
    }
  }

  /**
   * Set default project for workspace
   */
  async function setDefaultProject(projectKey: string): Promise<boolean> {
    loading.value = true

    const result = await jiraConfigApi.setDefaultProject(projectKey)

    loading.value = false

    if (isSuccess(result)) {
      config.value = result.data
      ElNotification.success({
        title: 'Success',
        message: 'Default project updated',
      })
      return true
    } else {
      error.value = result.error
      ElNotification.error({ title: 'Error', message: result.error })
      return false
    }
  }

  /**
   * Get current default project object
   */
  const defaultProject = computed(() => {
    if (!config.value?.defaultProjectKey) return null
    return projects.value.find((p: JiraProject) => p.key === config.value!.defaultProjectKey) || null
  })

  return {
    fetchProjects,
    setDefaultProject,
    defaultProject,
  }
}
