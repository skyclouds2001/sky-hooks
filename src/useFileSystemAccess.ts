import { computed, ref, shallowRef, watch, type ComputedRef, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue'

type DataType = 'Text' | 'ArrayBuffer' | 'Blob'

interface UseFileSystemAccessReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * file content of current file that is working on
   */
  data: Ref<string | ArrayBuffer | Blob | undefined>

  /**
   * current file that is working on
   */
  file: ShallowRef<File | undefined>

  /**
   * file name of current file that is working on
   */
  fileName: ComputedRef<string | undefined>

  /**
   * file MIME type of current file that is working on
   */
  fileMime: ComputedRef<string | undefined>

  /**
   * file size of current file that is working on
   */
  fileSize: ComputedRef<number | undefined>

  /**
   * file last modified timestamp of current file that is working on
   */
  fileLastModified: ComputedRef<number | undefined>

  /**
   * open the existed file as the operation target
   */
  open: (options?: OpenFilePickerOptions) => Promise<void>

  /**
   * create the new file as the operation target
   */
  create: (options?: SaveFilePickerOptions) => Promise<void>

  /**
   * save data to the specific file or create a new file
   */
  save: (options?: SaveFilePickerOptions) => Promise<void>
}

/**
 * reactive File System API and File System Access API
 * @param dataType data type of file content
 * @returns @see {@link UseFileSystemAccessReturn}
 */
const useFileSystemAccess = (dataType: MaybeRefOrGetter<DataType> = 'Text'): UseFileSystemAccessReturn => {
  const isSupported = 'showOpenFilePicker' in window && 'showSaveFilePicker' in window && 'showDirectoryPicker' in window

  let fileHandle: FileSystemFileHandle

  const data = ref<string | ArrayBuffer | Blob>()

  const file = shallowRef<File>()

  const fileName = computed(() => file.value?.name)
  const fileMime = computed(() => file.value?.type)
  const fileSize = computed(() => file.value?.size)
  const fileLastModified = computed(() => file.value?.lastModified)

  const updateFile = async (): Promise<void> => {
    file.value = await fileHandle?.getFile()
  }

  const updateData = async (): Promise<void> => {
    switch (dataType) {
      case 'Text':
        data.value = await file.value?.text()
        break
      case 'ArrayBuffer':
        data.value = await file.value?.arrayBuffer()
        break
      case 'Blob':
        data.value = file.value
        break
    }
  }

  const open = async (options?: OpenFilePickerOptions): Promise<void> => {
    if (!isSupported) return

    const [handle] = await window.showOpenFilePicker(options)
    fileHandle = handle

    await updateFile()
    await updateData()
  }

  const create = async (options?: SaveFilePickerOptions): Promise<void> => {
    if (!isSupported) return

    fileHandle = await window.showSaveFilePicker(options)

    await updateFile()
    await updateData()
  }

  const save = async (options?: SaveFilePickerOptions): Promise<void> => {
    if (!isSupported) return

    if (fileHandle === undefined) fileHandle = await window.showSaveFilePicker(options)

    if (data.value !== undefined) {
      const stream = await fileHandle.createWritable()
      await stream.write(data.value)
      await stream.close()
    }

    await updateFile()
  }

  if (isSupported) {
    watch(() => dataType, updateData)
  }

  return {
    isSupported,
    data,
    file,
    fileName,
    fileMime,
    fileSize,
    fileLastModified,
    open,
    create,
    save,
  }
}

export default useFileSystemAccess
