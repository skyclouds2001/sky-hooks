interface Window {
  readonly documentPictureInPicture: DocumentPictureInPicture
}

declare var documentPictureInPicture: DocumentPictureInPicture

interface DocumentPictureInPictureEventMap {
  enter: DocumentPictureInPictureEvent
}

interface DocumentPictureInPicture extends EventTarget {
  requestWindow: (options?: DocumentPictureInPictureOptions) => Promise<Window>
  readonly window: Window | null
  onenter: ((this: DocumentPictureInPicture, ev: DocumentPictureInPictureEvent) => any) | null
  addEventListener: <K extends keyof DocumentPictureInPictureEventMap>(type: K, listener: (this: DocumentPictureInPicture, ev: DocumentPictureInPictureEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof DocumentPictureInPictureEventMap>(type: K, listener: (this: DocumentPictureInPicture, ev: DocumentPictureInPictureEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var DocumentPictureInPicture: {
  prototype: DocumentPictureInPicture
}

interface DocumentPictureInPictureOptions {
  width: number
  height: number
}

interface DocumentPictureInPictureEvent extends Event {
  readonly window: Window
}

declare var DocumentPictureInPictureEvent: {
  prototype: DocumentPictureInPictureEvent
  new (type: string, eventInitDict: DocumentPictureInPictureEventInit): DocumentPictureInPictureEvent
}

interface DocumentPictureInPictureEventInit extends EventInit {
  window: Window
}
