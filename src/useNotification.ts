import { shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose, useEventListener } from '.'

interface UseNotificationReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * the current active notification object
   */
  notification: ShallowRef<Notification | null>

  /**
   * to show the notification
   */
  show: () => Promise<void>

  /**
   * to close the notification
   */
  close: () => Promise<void>
}

/**
 * reactive Notification API
 * @param title notification title
 * @param options notification options
 * @returns @see {@link UseNotificationReturn}
 */
const useNotification = (title: string, options: NotificationOptions = {}): UseNotificationReturn => {
  const isSupported = 'Notification' in window

  const notification = shallowRef<Notification | null>(null)

  const requestPermission = async (): Promise<void> => {
    if (!isSupported) return

    if ('permission' in Notification && Notification.permission !== 'denied') {
      await window.Notification.requestPermission()
    }
  }

  const show = async (overrides: NotificationOptions & { title?: string } = {}): Promise<void> => {
    if (!isSupported) return

    await requestPermission()

    notification.value = new window.Notification(overrides.title ?? title, Object.assign({}, options, overrides))
  }

  const close = async (): Promise<void> => {
    if (!isSupported) return

    if (notification.value !== null) {
      notification.value.close()
      notification.value = null
    }
  }

  if (isSupported) {
    useEventListener(document, 'visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        notification.value?.close()
      }
    })

    tryOnScopeDispose(close)
  }

  return {
    isSupported,
    notification,
    show,
    close,
  }
}

export default useNotification
