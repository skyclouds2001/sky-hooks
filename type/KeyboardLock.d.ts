interface Navigator {
  readonly keyboard: KeyBoard
}

interface KeyBoard extends EventTarget {
  getLayoutMap: () => Promise<KeyboardLayoutMap>
  lock: (keyCodes?: string[]) => Promise<void>
  unlock: () => void
  onlayoutchange: ((this: KeyBoard, ev: Event) => any) | null
  addEventListener: <K extends keyof KeyboardEventMap>(type: K, listener: (this: KeyBoard, ev: KeyboardEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof KeyboardEventMap>(type: K, listener: (this: KeyBoard, ev: KeyboardEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var KeyBoard: {
  prototype: KeyBoard
}

interface KeyboardEventMap {
  layoutchange: Event
}

interface KeyboardLayoutMap {
  entries: IterableIterator<[string, string]>
  keys: IterableIterator<string>
  readonly size: number
  values: IterableIterator<string>
  forEach: (callbackfn: (currentValue: string, key: string, map: Map<string, string>) => void, thisArg?: any) => void
  get: (key: string) => string | undefined
  has: (key: string) => boolean
  [Symbol.iterator]: IterableIterator<[string, string]>
}

declare var KeyboardLayoutMap: {
  prototype: KeyboardLayoutMap
}
