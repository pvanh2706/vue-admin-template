/**
 * Generic API response wrapper using Result pattern
 * Matches backend Result<T> structure
 * 
 * Uses discriminated union to prevent invalid states:
 * - Success responses MUST have data
 * - Failure responses MUST have error message
 * 
 * @example
 * // Success case
 * const successResponse: ApiResponse<User> = {
 *   isSuccess: true,
 *   data: { id: 1, name: "John" }
 * }
 * 
 * // Error case
 * const errorResponse: ApiResponse<User> = {
 *   isSuccess: false,
 *   error: "User not found"
 * }
 */
export type ApiResponse<T> =
  | { isSuccess: true; data: T }
  | { isSuccess: false; error: string }

/**
 * Type guard to narrow ApiResponse to success case
 * 
 * Verifies both the success flag and data presence to prevent
 * runtime errors from malformed backend responses.
 * 
 * @param response - The API response to check
 * @returns True if response is successful and has data
 * 
 * @example
 * const response = await fetchUser(1)
 * if (isSuccess(response)) {
 *   console.log(response.data.name) // TypeScript knows data exists
 * } else {
 *   console.error(response.error) // TypeScript knows error exists
 * }
 */
export function isSuccess<T>(
  response: ApiResponse<T>
): response is { isSuccess: true; data: T } {
  return response.isSuccess && response.data !== undefined
}
