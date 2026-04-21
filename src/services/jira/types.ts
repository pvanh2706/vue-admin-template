export type { ApiResponse } from '@/types/common'

/**
 * Jira issue type enumeration
 * Values match C# backend enum exactly (numeric)
 */
export enum IssueType {
  Bug = 0,
  Feature = 1,
  Task = 2,
  Story = 3,
  Epic = 4,
  Subtask = 5
}

/**
 * Jira issue priority enumeration
 * Values match C# backend enum exactly (numeric)
 */
export enum IssuePriority {
  Lowest = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  Highest = 4,
  Critical = 5
}

/**
 * Request DTO for creating a new Jira issue
 * Matches backend CreateIssueRequest exactly
 */
export interface CreateIssueRequest {
  /** Organization ID (Guid as string in JSON) */
  organizationId: string
  
  /** Jira project key (e.g., "PROJ") */
  projectKey: string
  
  /** Issue title/summary */
  summary: string
  
  /** Issue description (can be markdown) */
  description: string
  
  /** Issue type enum value */
  issueType: IssueType
  
  /** Priority enum value */
  priority: IssuePriority
  
  /** Jira internal issue type ID */
  issueTypeId: string
  
  /** Jira internal priority ID */
  priorityId: string
  
  /** Assignee account ID (optional) */
  assigneeAccountId?: string
  
  /** Labels array (optional) */
  labels?: string[]
}

/**
 * Request DTO for editing existing Jira issue
 * All fields optional - only send what changes
 */
export interface EditIssueRequest {
  summary?: string
  description?: string
  priorityId?: string
  assigneeAccountId?: string
  labelsToAdd?: string[]
  labelsToRemove?: string[]
}

/**
 * Request DTO for transitioning issue status
 */
export interface TransitionIssueRequest {
  /** Jira transition ID */
  transitionId: string
  
  /** Optional comment to add during transition */
  comment?: string
}

/**
 * Jira issue details response
 * Returned from GET /api/jira/issues/{key}
 */
export interface JiraIssue {
  /** Issue key (e.g., "PROJ-123") */
  key: string
  
  /** Issue summary/title */
  summary: string
  
  /** Issue description */
  description: string
  
  /** Current status name */
  status: string
  
  /** Issue type name */
  issueType: string
  
  /** Priority name */
  priority: string
  
  /** Assignee display name (optional) */
  assignee?: string
  
  /** Creation timestamp (ISO 8601) */
  created: string
  
  /** Last updated timestamp (ISO 8601) */
  updated: string
  
  /** Direct URL to issue in Jira */
  url: string
}

/**
 * Jira transition option
 * Returned from GET /api/jira/issues/{key}/transitions
 */
export interface JiraTransition {
  /** Transition ID */
  id: string
  
  /** Transition name (e.g., "In Progress", "Done") */
  name: string
  
  /** Destination status details */
  to: {
    id: string
    name: string
  }
}
