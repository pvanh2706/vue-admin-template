/**
 * Jira configuration stored in backend
 */
export interface JiraConfig {
  id: string
  jiraUrl: string
  jiraEmail: string
  isConnected: boolean
  lastTested: string | null  // ISO 8601 timestamp
  lastSynced: string | null  // ISO 8601 timestamp
  createdAt: string          // ISO 8601 timestamp
  defaultProjectKey: string | null
}

/**
 * Request payload for saving Jira configuration
 */
export interface SaveConfigRequest {
  jiraUrl: string
  jiraEmail: string
  jiraApiToken: string
}

/**
 * Request payload for testing connection
 */
export interface TestConnectionRequest {
  jiraUrl: string
  jiraEmail: string
  jiraApiToken: string
}

/**
 * Response from test connection endpoint
 */
export interface TestConnectionResponse {
  success: boolean
  message: string
  jiraInstanceInfo?: {
    baseUrl: string
    version: string
    serverTitle: string
  }
}

/**
 * Jira project information
 */
export interface JiraProject {
  key: string
  name: string
  projectTypeKey: string  // e.g., 'software', 'business'
  lead: {
    accountId: string
    displayName: string
    emailAddress: string
  }
  avatarUrl?: string
  description?: string
}

/**
 * Jira metadata (issue types, priorities, statuses)
 */
export interface JiraMetadata {
  issueTypes: JiraIssueType[]
  priorities: JiraPriority[]
  statuses: JiraStatus[]
}

export interface JiraIssueType {
  id: string
  name: string
  description: string
  iconUrl: string
  subtask: boolean
}

export interface JiraPriority {
  id: string
  name: string
  description: string
  iconUrl: string
  statusColor: string  // e.g., '#FF0000'
}

export interface JiraStatus {
  id: string
  name: string
  description: string
  statusCategory: {
    key: string           // e.g., 'new', 'indeterminate', 'done'
    name: string
    colorName: string     // e.g., 'blue-gray', 'yellow', 'green'
  }
}

/**
 * Response from fetch projects endpoint
 */
export interface FetchProjectsResponse {
  projects: JiraProject[]
  metadata: JiraMetadata
}
