interface Window {
  showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>
  showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
}

declare var showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>

declare var showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>

interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string | string[]>
}

interface FilePickerOptions {
  excludeAcceptAllOption?: boolean
  id?: string
  types?: FilePickerAcceptType[]
  startIn?: StartInDirectory
}

interface OpenFilePickerOptions extends FilePickerOptions {
  multiple?: boolean
}

interface SaveFilePickerOptions extends FilePickerOptions {
  suggestedName?: string
}

type WellKnownDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos'

type StartInDirectory = WellKnownDirectory | FileSystemHandle
