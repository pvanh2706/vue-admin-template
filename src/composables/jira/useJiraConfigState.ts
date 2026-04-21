import { reactive, toRef, computed } from 'vue'
import type { JiraConfig, JiraProject, JiraMetadata } from '@/types/jira/config'

/**
 * Singleton reactive state for Jira configuration
 * Shared across all Jira config components
 */
const state = reactive({
  config: null as JiraConfig | null,
  loading: false,
  error: null as string | null,
  projects: [] as JiraProject[],
  metadata: null as JiraMetadata | null,
})

/**
 * Shared state composable for Jira configuration
 * Uses singleton pattern for application-level state
 */
export function useJiraConfigState() {
  return {
    config: toRef(state, 'config'),
    loading: toRef(state, 'loading'),
    error: toRef(state, 'error'),
    projects: toRef(state, 'projects'),
    metadata: toRef(state, 'metadata'),
    hasConfig: computed(() => state.config !== null),
  }
}
