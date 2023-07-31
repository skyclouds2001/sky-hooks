declare var VirtualKeyboard: VirtualKeyboard
declare var VirtualKeyboardGeometryChangeEvent: VirtualKeyboardGeometryChangeEvent

interface Navigator {
  readonly virtualKeyboard: VirtualKeyboard
}

interface VirtualKeyboard extends EventTarget {
  boundingRect: DOMRect
  overlaysContent: boolean
  hide: () => void
  show: () => void
  ongeometrychange: ((this: VirtualKeyboard, ev: VirtualKeyboardGeometryChangeEvent) => any) | null
  addEventListener: <K extends keyof VirtualKeyboardEventMap>(type: K, listener: (this: VirtualKeyboard, ev: VirtualKeyboardEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof VirtualKeyboardEventMap>(type: K, listener: (this: VirtualKeyboard, ev: VirtualKeyboardEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

interface VirtualKeyboardEventMap {
  geometrychange: VirtualKeyboardGeometryChangeEvent
}

interface VirtualKeyboardGeometryChangeEvent extends Event {}
