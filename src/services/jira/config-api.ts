import { apiCall } from '@/utils/api'
import type { ApiResponse } from '@/types/common'
import type {
  JiraConfig,
  SaveConfigRequest,
  TestConnectionRequest,
  TestConnectionResponse,
  FetchProjectsResponse,
} from '@/types/jira/config'

/**
 * Jira Configuration API Service
 * Handles all API calls related to Jira connection configuration
 */
export const jiraConfigApi = {
  /**
   * Get current Jira configuration
   * GET /api/jira/config
   */
  async getConfig(): Promise<ApiResponse<JiraConfig>> {
    return apiCall<JiraConfig>('get', '/api/jira/config')
  },

  /**
   * Save Jira configuration (create or update)
   * POST /api/jira/config
   */
  async saveConfig(data: SaveConfigRequest): Promise<ApiResponse<JiraConfig>> {
    return apiCall<JiraConfig, SaveConfigRequest>('post', '/api/jira/config', data)
  },

  /**
   * Test Jira connection with provided credentials
   * POST /api/jira/config/test
   */
  async testConnection(data: TestConnectionRequest): Promise<ApiResponse<TestConnectionResponse>> {
    return apiCall<TestConnectionResponse, TestConnectionRequest>('post', '/api/jira/config/test', data)
  },

  /**
   * Delete Jira configuration
   * DELETE /api/jira/config
   */
  async deleteConfig(): Promise<ApiResponse<void>> {
    return apiCall<void>('delete', '/api/jira/config')
  },

  /**
   * Fetch available projects from Jira
   * GET /api/jira/config/projects
   */
  async fetchProjects(): Promise<ApiResponse<FetchProjectsResponse>> {
    return apiCall<FetchProjectsResponse>('get', '/api/jira/config/projects')
  },

  /**
   * Set default project for workspace
   * PUT /api/jira/config/default-project
   */
  async setDefaultProject(projectKey: string): Promise<ApiResponse<JiraConfig>> {
    return apiCall<JiraConfig, { projectKey: string }>('put', '/api/jira/config/default-project', { projectKey })
  },
}
