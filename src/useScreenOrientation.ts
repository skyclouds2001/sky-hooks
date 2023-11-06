import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseScreenOrientationReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * screen orientation type
   */
  type: DeepReadonly<Ref<OrientationType>>

  /**
   * screen orientation angel
   */
  angel: DeepReadonly<Ref<number>>

  /**
   * lock the screen orientation
   */
  lock: (type: OrientationLockType) => Promise<void>

  /**
   * unlock the screen orientation
   */
  unlock: () => Promise<void>
}

/**
 * reactive screen orientation
 * @returns @see {@link UseScreenOrientationReturn}
 */
const useScreenOrientation = (): UseScreenOrientationReturn => {
  const isSupported = 'screen' in window && 'orientation' in screen

  const type = ref(screen.orientation.type)
  const angel = ref(screen.orientation.angle)

  const lock = async (type: OrientationLockType): Promise<void> => {
    await screen.orientation.lock(type)
  }

  const unlock = async (): Promise<void> => {
    screen.orientation.unlock()
  }

  useEventListener(screen.orientation, 'change', () => {
    type.value = screen.orientation.type
    angel.value = screen.orientation.angle
  })

  return {
    isSupported,
    type: readonly(type),
    angel: readonly(angel),
    lock,
    unlock,
  }
}

export default useScreenOrientation
