import { getCurrentScope, onScopeDispose } from 'vue'

type UseEventListenerOptions = AddEventListenerOptions | EventListenerOptions | boolean

function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E | E[], listener: (this: Window, e: WindowEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E | E[], listener: (this: Document, e: DocumentEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ShadowRootEventMap>(target: ShadowRoot, event: E | E[], listener: (this: ShadowRoot, e: ShadowRootEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends string>(target: EventTarget, event: E | E[], listener: (this: EventTarget, e: Event) => void, options?: UseEventListenerOptions): () => void

function useEventListener<T extends EventTarget, M extends Record<string, any>, E extends keyof M>(target: T, event: E | E[], listener: (this: T, e: M[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener(target: EventTarget, event: string | string[], listener: (this: EventTarget, e: Event) => void, options?: UseEventListenerOptions): () => void {
  if (Array.isArray(event)) {
    event.forEach((e) => {
      target.addEventListener(e, listener, options)
    })
  } else {
    target.addEventListener(event, listener, options)
  }

  const stop = (): void => {
    if (Array.isArray(event)) {
      event.forEach((e) => {
        target.removeEventListener(e, listener, options)
      })
    } else {
      target.removeEventListener(event, listener, options)
    }
  }

  if (getCurrentScope() !== undefined) {
    onScopeDispose(() => {
      stop()
    })
  }

  return stop
}

export default useEventListener
