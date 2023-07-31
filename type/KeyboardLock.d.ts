declare var KeyBoard: KeyBoard

declare var KeyboardLayoutMap: KeyboardLayoutMap

interface Navigator {
  keyboard: KeyBoard
}

interface KeyBoard extends EventTarget {
  getLayoutMap: () => Promise<KeyboardLayoutMap>
  lock: (keyCodes?: string[]) => Promise<void>
  unlock: () => Promise<void>
}

interface KeyboardLayoutMap {
  readonly entries: IterableIterator<[string, string]>
  readonly keys: IterableIterator<string>
  readonly size: number
  readonly values: IterableIterator<string>
  forEach: (callbackfn: (currentValue: string, key: string, map: Map<string, string>) => void, thisArg?: any) => void
  get: (key: string) => string | undefined
  has: (key: string) => boolean
  [Symbol.iterator]: IterableIterator<[string, string]>
}
