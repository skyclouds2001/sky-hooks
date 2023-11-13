interface Screen extends EventTarget {
  readonly isExtended: boolean
  onchange: ((this: Screen, ev: Event) => any) | null
  addEventListener: <K extends keyof ScreenEventMap>(type: K, listener: (this: Screen, ev: ScreenEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof ScreenEventMap>(type: K, listener: (this: Screen, ev: ScreenEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

interface ScreenEventMap {
  change: Event
}
