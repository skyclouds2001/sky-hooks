import { shallowReadonly, shallowRef, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'
import usePermission from './usePermission'

interface UseWindowManagementOptions {
  /**
   * whether immediate get the screen details
   * @default false
   */
  immediate: boolean
}

interface UseWindowManagementReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * API permission status
   */
  permission: ReturnType<typeof usePermission>['status']

  /**
   * API permission status
   */
  screens: Readonly<ShallowRef<ScreenDetailed[]>>

  /**
   * API permission status
   */
  currentScreen: Readonly<ShallowRef<ScreenDetailed | null>>

  /**
   * API permission status
   */
  init: () => Promise<void>
}

/**
 * reactive Window Management API
 * @param options @see {@link UseWindowManagementOptions}
 * @returns @see {@link UseWindowManagementReturn}
 */
const useWindowManagement = (options: UseWindowManagementOptions): UseWindowManagementReturn => {
  const isSupported = 'getScreenDetails' in window

  const { status: permission } = usePermission('window-management')

  const screens = shallowRef<ScreenDetailed[]>([])

  const currentScreen = shallowRef<ScreenDetailed | null>(null)

  const init = async (): Promise<void> => {
    const screenDetails = await window.getScreenDetails()

    const update = (): void => {
      screens.value = screenDetails.screens
      currentScreen.value = screenDetails.currentScreen
    }

    update()

    useEventListener(screenDetails, 'screenschange', update)

    useEventListener(screenDetails, 'currentscreenchange', update)
  }

  if (options.immediate) {
    void init()
  }

  return {
    isSupported,
    permission,
    screens: shallowReadonly(screens),
    currentScreen: shallowReadonly(currentScreen),
    init,
  }
}

export default useWindowManagement
