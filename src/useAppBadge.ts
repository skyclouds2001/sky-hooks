import { ref, watch, type Ref } from 'vue'
import usePermission from './usePermission'

interface UseAppBadgeReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * badging permission status
   */
  permission: ReturnType<typeof usePermission>['status']

  /**
   * badge contents
   */
  contents: Ref<number | undefined>

  /**
   * update the badge using the passing contents
   */
  update: (count: number) => void

  /**
   * clear the badge
   */
  clear: () => void
}

/**
 * reactive Badging API
 * @param initial initial value for badge
 * @returns @see {@link UseAppBadgeReturn}
 */
const useAppBadge = (initial = 0): UseAppBadgeReturn => {
  const isSupported = 'clearAppBadge' in navigator && 'setAppBadge' in navigator

  const { status: permission } = usePermission('notifications')

  const contents = ref<number | undefined>(initial)

  const update = (count?: number): void => {
    contents.value = count
  }

  const clear = (): void => {
    contents.value = 0
  }

  if (isSupported) {
    watch(
      contents,
      (contents) => {
        if (contents !== 0) {
          void navigator.setAppBadge(contents)
        } else {
          void navigator.clearAppBadge()
        }
      },
      {
        immediate: true,
      }
    )
  }

  return {
    isSupported,
    permission,
    contents,
    update,
    clear,
  }
}

export default useAppBadge
