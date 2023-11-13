import { readonly, ref, type DeepReadonly, type Ref } from 'vue'

interface UseFileDialogOptions {
  /**
   * whether allow to select multiple files
   * @default true
   */
  multiple?: boolean

  /**
   * support to select files
   * @default '*'
   */
  accept?: string

  /**
   * whether allow to select multiple files
   * @default 'environment'
   */
  capture?: 'user' | 'environment'
}

interface UseFileDialogReturn {
  /**
   * selected files
   */
  files: DeepReadonly<Ref<FileList | null>>

  /**
   * open a file dialog to select files
   * @param options method level options
   */
  open: (options?: UseFileDialogOptions) => void

  /**
   * reset the selected files to empty
   */
  reset: () => void
}

/**
 * reactive file dialog
 * @param options hook level options
 * @returns @see {@link UseFileDialogReturn}
 */
const useFileDialog = (options: UseFileDialogOptions = {}): UseFileDialogReturn => {
  const files = ref<FileList | null>(null)

  const input = document.createElement('input')
  input.type = 'file'
  input.addEventListener(
    'change',
    (e) => {
      files.value = (e.target as HTMLInputElement).files
    },
    {
      passive: true,
    }
  )

  const open = (localOptions: UseFileDialogOptions = {}): void => {
    const { multiple = true, accept = '*', capture = 'environment' } = { ...options, ...localOptions }

    input.multiple = multiple
    input.accept = accept
    input.capture = capture

    input.click()
  }

  const reset = (): void => {
    files.value = null
  }

  return {
    files: readonly(files),
    open,
    reset,
  }
}

export default useFileDialog
