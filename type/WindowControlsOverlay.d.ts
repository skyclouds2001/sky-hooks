interface Navigator {
  readonly windowControlsOverlay: WindowControlsOverlay
}

interface WindowControlsOverlay extends EventTarget {
  readonly visible: boolean
  getTitlebarAreaRect: () => DOMRect
  ongeometrychange: ((this: WindowControlsOverlay, ev: WindowControlsOverlayGeometryChangeEvent) => any) | null
  addEventListener: <K extends keyof WindowControlsOverlayEventMap>(type: K, listener: (this: WindowControlsOverlay, ev: WindowControlsOverlayEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof WindowControlsOverlayEventMap>(type: K, listener: (this: WindowControlsOverlay, ev: WindowControlsOverlayEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var WindowControlsOverlay: {
  prototype: WindowControlsOverlay
}

interface WindowControlsOverlayEventMap {
  geometrychange: WindowControlsOverlayGeometryChangeEvent
}

interface WindowControlsOverlayGeometryChangeEvent extends Event {
  readonly titlebarAreaRect: DOMRect
  readonly visible: boolean
}

declare var WindowControlsOverlayGeometryChangeEvent: {
  prototype: WindowControlsOverlayGeometryChangeEvent
  new (type: string, initDict?: WindowControlsOverlayGeometryChangeEventInit): WindowControlsOverlayGeometryChangeEvent
}

interface WindowControlsOverlayGeometryChangeEventInit extends EventInit {
  visible: boolean
  titlebarAreaRect: DOMRect
}
