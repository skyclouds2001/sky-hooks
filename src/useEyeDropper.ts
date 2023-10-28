import { readonly, ref, type Ref } from 'vue'

interface useEyeDropperReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * select color
   */
  color: Readonly<Ref<string | null>>

  /**
   * open a select to set a color
   */
  open: (options?: ColorSelectionOptions) => Promise<void>
}

/**
 * reactive Badging API
 * @param initial initial value for eye dropper, default to `null`
 * @returns @see {@link useEyeDropperReturn}
 */
const useEyeDropper = (initial: string | null = null): useEyeDropperReturn => {
  const isSupported = 'EyeDropper' in window

  const color = ref(initial)

  const open = async (options?: ColorSelectionOptions): Promise<void> => {
    if (!isSupported) return

    const { sRGBHex } = await new window.EyeDropper().open(options)
    color.value = sRGBHex
  }

  return {
    isSupported,
    color: readonly(color),
    open,
  }
}

export default useEyeDropper
