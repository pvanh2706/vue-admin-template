import { ElNotification, ElMessageBox } from 'element-plus'
import { useJiraConfigState } from './useJiraConfigState'
import { jiraConfigApi } from '@/services/jira/config-api'
import { isSuccess } from '@/types/common'
import type { SaveConfigRequest, TestConnectionRequest } from '@/types/jira/config'

/**
 * Composable for Jira connection operations
 * Handles fetching, saving, testing, and deleting Jira configuration
 */
export function useJiraConnection() {
  const { config, loading, error, projects, metadata } = useJiraConfigState()

  /**
   * Fetch current Jira configuration from backend
   */
  async function fetchConfig() {
    loading.value = true
    error.value = null

    const result = await jiraConfigApi.getConfig()

    if (isSuccess(result)) {
      config.value = result.data
    } else {
      error.value = result.error
      // Don't show notification if config doesn't exist yet (expected)
      // Only show error for unexpected failures
      if (result.error !== 'Configuration not found') {
        ElNotification.error({ title: 'Error', message: result.error })
      }
    }

    loading.value = false
  }

  /**
   * Save Jira configuration (create or update)
   */
  async function saveConfig(data: SaveConfigRequest): Promise<boolean> {
    loading.value = true
    error.value = null

    const result = await jiraConfigApi.saveConfig(data)

    loading.value = false

    if (isSuccess(result)) {
      config.value = result.data
      ElNotification.success({ title: 'Success', message: 'Configuration saved' })
      return true
    } else {
      error.value = result.error
      ElNotification.error({ title: 'Error', message: result.error })
      return false
    }
  }

  /**
   * Test Jira connection with provided credentials
   */
  async function testConnection(data: TestConnectionRequest): Promise<boolean> {
    loading.value = true

    const result = await jiraConfigApi.testConnection(data)

    loading.value = false

    if (isSuccess(result)) {
      ElNotification.success({
        title: 'Success',
        message: result.data.message || 'Connection successful',
      })
      return true
    } else {
      ElNotification.error({ title: 'Connection Failed', message: result.error })
      return false
    }
  }

  /**
   * Delete Jira configuration
   */
  async function deleteConfig(): Promise<boolean> {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to disconnect from Jira? This will remove all Jira configuration.',
        'Confirm Disconnect',
        { type: 'warning', confirmButtonText: 'Disconnect', cancelButtonText: 'Cancel' }
      )
    } catch {
      // User cancelled
      return false
    }

    loading.value = true

    const result = await jiraConfigApi.deleteConfig()

    loading.value = false

    if (isSuccess(result)) {
      config.value = null
      projects.value = []
      metadata.value = null
      ElNotification.success({ title: 'Success', message: 'Disconnected from Jira' })
      return true
    } else {
      error.value = result.error
      ElNotification.error({ title: 'Error', message: result.error })
      return false
    }
  }

  return {
    fetchConfig,
    saveConfig,
    testConnection,
    deleteConfig,
  }
}
