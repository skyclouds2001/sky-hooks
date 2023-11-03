import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

interface UseClipboardOptions {
  /**
   * keep copied data delay
   */
  delay?: number

  /**
   * whether listen to `copy` and `cut` event and
   */
  listen?: boolean
}

interface UseClipboardReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * copied data
   */
  text: DeepReadonly<Ref<string>>

  /**
   * whether data is copied to clipboard yet, will reset in a delay
   */
  isCopied: DeepReadonly<Ref<boolean>>

  /**
   * copy data to clipboard
   */
  copy: (data: string) => Promise<void>
}

/**
 * reactive Clipboard API
 * @param options @see {@link UseClipboardOptions}
 * @returns @see {@link UseClipboardReturn}
 */
const useClipboard = (options: UseClipboardOptions = {}): UseClipboardReturn => {
  const { delay = 2500, listen = true } = options

  const isSupported = 'clipboard' in navigator

  const text = ref('')

  const isCopied = ref(false)

  const fn = useTimeout(() => {
    isCopied.value = false
  }, delay)

  const copy = async (data: string): Promise<void> => {
    if (!isSupported) return

    fn.pause()
    isCopied.value = false

    await navigator.clipboard.writeText(data)

    text.value = data
    isCopied.value = true
    fn.resume()
  }

  if (isSupported && listen) {
    useEventListener(window, 'copy', () => {
      void navigator.clipboard.readText().then((data) => {
        text.value = data
      })
    })
    useEventListener(window, 'cut', () => {
      void navigator.clipboard.readText().then((data) => {
        text.value = data
      })
    })
  }

  return {
    isSupported,
    text: readonly(text),
    isCopied: readonly(isCopied),
    copy,
  }
}

export default useClipboard
