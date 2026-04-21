import { apiCall } from '@/utils/api'
import type { ApiResponse } from './types'
import type { 
  CreateIssueRequest, 
  EditIssueRequest, 
  TransitionIssueRequest,
  JiraIssue,
  JiraTransition
} from './types'

/**
 * Jira API service
 * All functions return ApiResponse<T> following Result pattern
 */
export const jiraApi = {
  /**
   * Creates a new Jira issue in the specified project
   * @param request - Issue creation data
   * @returns API response with created issue key and URL
   * @example
   * const result = await jiraApi.createIssue({
   *   organizationId: '123e4567-e89b-12d3-a456-426614174000',
   *   projectKey: 'PROJ',
   *   summary: 'Fix login bug',
   *   description: 'Users cannot login on mobile',
   *   issueType: IssueType.Bug,
   *   priority: IssuePriority.High,
   *   issueTypeId: '10001',
   *   priorityId: '3'
   * })
   */
  async createIssue(
    request: CreateIssueRequest
  ): Promise<ApiResponse<{ issueKey: string; url: string }>> {
    return apiCall<{ issueKey: string; url: string }, CreateIssueRequest>('post', '/api/jira/issues', request)
  },

  /**
   * Updates an existing Jira issue
   * @param issueKey - Issue key (e.g., "PROJ-123")
   * @param request - Fields to update
   * @returns API response indicating success or failure
   */
  async editIssue(
    issueKey: string,
    request: EditIssueRequest
  ): Promise<ApiResponse<void>> {
    return apiCall<void, EditIssueRequest>('put', `/api/jira/issues/${issueKey}`, request)
  },

  /**
   * Retrieves Jira issue details
   * @param issueKey - Issue key (e.g., "PROJ-123")
   * @returns API response with issue details including key, summary, description, type, priority, and status
   */
  async getIssue(
    issueKey: string
  ): Promise<ApiResponse<JiraIssue>> {
    return apiCall<JiraIssue>('get', `/api/jira/issues/${issueKey}`)
  },

  /**
   * Gets available transitions for an issue
   * @param issueKey - Issue key (e.g., "PROJ-123")
   * @returns API response with array of available transitions for the issue
   */
  async getTransitions(
    issueKey: string
  ): Promise<ApiResponse<JiraTransition[]>> {
    return apiCall<JiraTransition[]>('get', `/api/jira/issues/${issueKey}/transitions`)
  },

  /**
   * Transitions issue to a new status
   * @param issueKey - Issue key (e.g., "PROJ-123")
   * @param request - Transition details
   * @returns API response indicating success or failure of the transition
   */
  async transitionIssue(
    issueKey: string,
    request: TransitionIssueRequest
  ): Promise<ApiResponse<void>> {
    return apiCall<void, TransitionIssueRequest>('post', `/api/jira/issues/${issueKey}/transitions`, request)
  }
}
