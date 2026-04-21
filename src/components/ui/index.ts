/**
 * UI Components Export
 * 
 * Tập trung export tất cả UI components để dễ import
 * 
 * Usage:
 * import { AppButton, AppInput, AppTable } from '@/components/ui'
 */

// Export all Element Plus wrapper components
export * from './element-plus'

// Re-export with namespace for clarity (optional usage)
import * as ElementPlusWrappers from './element-plus'
export { ElementPlusWrappers }

/**
 * Example Usage in components:
 * 
 * // Single import
 * import { AppButton } from '@/components/ui'
 * 
 * // Multiple imports
 * import { 
 *   AppButton, 
 *   AppInput, 
 *   AppSelect,
 *   AppTable,
 *   AppPagination 
 * } from '@/components/ui'
 * 
 * // Namespace import (when you need all)
 * import { ElementPlusWrappers } from '@/components/ui'
 * const { AppButton, AppInput } = ElementPlusWrappers
 */
