import api from '@/services/api/axios'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/common'

/**
 * Generic API call wrapper with Result pattern
 * Shared utility used across all service modules (Jira, Knowledge, Tasks, etc.)
 * 
 * Handles GET/DELETE vs POST/PUT method differences:
 * - GET/DELETE: Data passed as query params
 * - POST/PUT: Data passed as request body
 * 
 * Note: Errors are logged by the global axios interceptor.
 * This function focuses on transforming errors to Result pattern.
 * 
 * @param method - HTTP method
 * @param endpoint - API endpoint path
 * @param data - Request data (params for GET/DELETE, body for POST/PUT)
 * @returns ApiResponse with Result pattern
 * 
 * @example
 * // GET request
 * const result = await apiCall<User>('get', '/api/users/123')
 * 
 * @example
 * // POST request with data
 * const result = await apiCall<CreateResponse, CreateRequest>(
 *   'post', 
 *   '/api/users', 
 *   { name: 'John', email: 'john@example.com' }
 * )
 * 
 * @example
 * // Handle response
 * if (result.isSuccess) {
 *   console.log('Data:', result.data)
 * } else {
 *   console.error('Error:', result.error)
 * }
 */
export async function apiCall<TResponse, TRequest = unknown>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  data?: TRequest
): Promise<ApiResponse<TResponse>> {
  try {
    // GET/DELETE use query params, POST/PUT use request body
    const response = method === 'get' || method === 'delete'
      ? await api[method]<TResponse>(endpoint, data ? { params: data } : undefined)
      : await api[method]<TResponse>(endpoint, data)
    
    return {
      isSuccess: true,
      data: response.data
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string; title?: string }>
    
    // Extract error message from various possible backend formats
    const errorMessage = 
      axiosError.response?.data?.error ||      // Custom format
      axiosError.response?.data?.message ||    // Standard format
      axiosError.response?.data?.title ||      // ProblemDetails
      axiosError.response?.statusText ||       // HTTP status text
      axiosError.message ||                    // Axios error message
      'An unexpected error occurred'
    
    return {
      isSuccess: false,
      error: errorMessage
    }
  }
}
