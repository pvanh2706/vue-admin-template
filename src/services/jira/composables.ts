import { ref, type Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { jiraApi } from './api'
import type { 
  ApiResponse,
  CreateIssueRequest,
  EditIssueRequest,
  TransitionIssueRequest,
  JiraIssue,
  JiraTransition
} from './types'

/**
 * Options for composable behavior
 */
interface ComposableOptions {
  /** If true, do not show error notifications (default: false) */
  silent?: boolean
}

/**
 * Generic composable factory
 * Creates Vue composables that wrap API calls with reactive state
 * 
 * @param apiCall - API function to wrap
 * @returns Composable function that returns { loading, result, execute }
 */
function createComposable<TRequest, TResponse>(
  apiCall: (request: TRequest) => Promise<ApiResponse<TResponse>>
) {
  return (options: ComposableOptions = {}) => {
    const loading = ref(false)
    const result: Ref<ApiResponse<TResponse> | null> = ref(null)
    
    const execute = async (request: TRequest) => {
      loading.value = true
      result.value = null // Clear stale data
      
      try {
        const response = await apiCall(request)
        result.value = response
        
        // Hybrid error handling: show notification unless silent
        if (!response.isSuccess && !options.silent) {
          ElNotification({
            title: 'Lỗi',
            message: response.error || 'Có lỗi xảy ra',
            type: 'error',
            duration: 3000
          })
        }
        
        return response
      } catch (unexpectedError) {
        // Handle exceptions that escape apiCall
        const errorResponse: ApiResponse<TResponse> = {
          isSuccess: false,
          error: 'Unexpected error occurred'
        }
        result.value = errorResponse
        return errorResponse
      } finally {
        loading.value = false
      }
    }
    
    const reset = () => {
      result.value = null
      loading.value = false
    }
    
    return {
      loading,
      result,
      execute,
      reset
    }
  }
}

/**
 * Composable for creating Jira issues
 * 
 * @param options - Composable options (silent mode, etc.)
 * @returns { loading, result, execute }
 * 
 * @example
 * const { loading, result, execute } = useCreateIssue()
 * await execute(createIssueData)
 * if (result.value?.isSuccess) {
 *   console.log('Created:', result.value.data.issueKey)
 * }
 */
export const useCreateIssue = createComposable<
  CreateIssueRequest,
  { issueKey: string; url: string }
>(jiraApi.createIssue)

/**
 * Composable for editing Jira issues
 * Provides cleaner API by accepting issueKey as separate parameter
 * 
 * @example
 * const { loading, execute } = useEditIssue()
 * await execute('PROJ-123', { summary: 'Updated title' })
 */
export function useEditIssue(options: ComposableOptions = {}) {
  const { loading, result, execute: baseExecute, reset } = createComposable<
    { issueKey: string; request: EditIssueRequest },
    void
  >(({ issueKey, request }) => jiraApi.editIssue(issueKey, request))(options)
  
  const execute = (issueKey: string, request: EditIssueRequest) => {
    return baseExecute({ issueKey, request })
  }
  
  return { loading, result, execute, reset }
}

/**
 * Composable for fetching Jira issue details
 * 
 * @example
 * const { loading, result, execute } = useGetIssue()
 * await execute('PROJ-123')
 * if (result.value?.isSuccess) {
 *   console.log(result.value.data.summary)
 * }
 */
export function useGetIssue(options: ComposableOptions = {}) {
  const { loading, result, execute: baseExecute, reset } = createComposable<
    string,
    JiraIssue
  >(jiraApi.getIssue)(options)
  
  const execute = (issueKey: string) => {
    return baseExecute(issueKey)
  }
  
  return { loading, result, execute, reset }
}

/**
 * Composable for fetching available issue transitions
 * 
 * @example
 * const { loading, result, execute } = useGetTransitions()
 * await execute('PROJ-123')
 * if (result.value?.isSuccess) {
 *   const transitions = result.value.data
 *   transitions.forEach(t => console.log(t.name))
 * }
 */
export function useGetTransitions(options: ComposableOptions = {}) {
  const { loading, result, execute: baseExecute, reset } = createComposable<
    string,
    JiraTransition[]
  >(jiraApi.getTransitions)(options)
  
  const execute = (issueKey: string) => {
    return baseExecute(issueKey)
  }
  
  return { loading, result, execute, reset }
}

/**
 * Composable for transitioning issue status
 * 
 * @example
 * const { loading, execute } = useTransitionIssue()
 * await execute('PROJ-123', {
 *   transitionId: '31',
 *   comment: 'Moving to Done'
 * })
 */
export function useTransitionIssue(options: ComposableOptions = {}) {
  const { loading, result, execute: baseExecute, reset } = createComposable<
    { issueKey: string; request: TransitionIssueRequest },
    void
  >(({ issueKey, request }) => jiraApi.transitionIssue(issueKey, request))(options)
  
  const execute = (issueKey: string, request: TransitionIssueRequest) => {
    return baseExecute({ issueKey, request })
  }
  
  return { loading, result, execute, reset }
}
