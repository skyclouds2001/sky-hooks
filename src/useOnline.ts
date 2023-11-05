import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseOnlineReturn {
  /**
   * whether currently network status in online mode
   */
  isOnline: DeepReadonly<Ref<boolean>>

  /**
   * timestamp of the most recent network status change to online
   */
  onlineAt: DeepReadonly<Ref<number | null>>

  /**
   * timestamp of the most recent network status change to offline
   */
  offlineAt: DeepReadonly<Ref<number | null>>
}

/**
 * reactive online status
 * @returns @see {@link UseOnlineReturn}
 */
const useOnline = (): UseOnlineReturn => {
  const isOnline = ref(navigator.onLine)

  const onlineAt = ref(isOnline.value ? Date.now() : null)

  const offlineAt = ref(isOnline.value ? null : Date.now())

  useEventListener(window, 'online', () => {
    isOnline.value = navigator.onLine
    onlineAt.value = isOnline.value ? Date.now() : null
  })

  useEventListener(window, 'offline', () => {
    isOnline.value = navigator.onLine
    offlineAt.value = isOnline.value ? null : Date.now()
  })

  return {
    isOnline: readonly(isOnline),
    onlineAt: readonly(onlineAt),
    offlineAt: readonly(offlineAt),
  }
}

export default useOnline
