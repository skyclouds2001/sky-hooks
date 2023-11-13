import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'
import useEventListener from './useEventListener'

type PermissionEnum = PermissionName | 'accelerometer' | 'accessibility-events' | 'ambient-light-sensor' | 'background-sync' | 'camera' | 'clipboard-read' | 'clipboard-write' | 'gyroscope' | 'local-fonts' | 'magnetometer' | 'microphone' | 'midi' | 'payment-handler' | 'speaker-selection' | 'storage-access' | 'window-management'

interface UsePermissionReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * the permission status
   */
  status: DeepReadonly<Ref<PermissionState | null>>
}

/**
 * reactive Permissions API
 * @param name permission name
 * @returns @see {@link UsePermissionReturn}
 */
const usePermission = (name: MaybeRefOrGetter<PermissionEnum>): UsePermissionReturn => {
  const isSupported = 'permissions' in navigator

  const permission = ref<PermissionState | null>(null)

  let permissionStatus: PermissionStatus

  if (isSupported) {
    watch(
      () => toValue(name),
      (name) => {
        void navigator.permissions.query({ name: toValue(name) as PermissionName }).then((status) => {
          permissionStatus = status

          permission.value = permissionStatus.state

          useEventListener(status, 'change', () => {
            permission.value = permissionStatus.state
          })
        })
      },
      {
        immediate: true,
      }
    )
  }

  return {
    isSupported,
    status: readonly(permission),
  }
}

export default usePermission
