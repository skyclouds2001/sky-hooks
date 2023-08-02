import { tryOnScopeDispose } from '.'

type UseEventListenerOptions = AddEventListenerOptions | EventListenerOptions | boolean

function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E, listener: (this: Window, e: WindowEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E, listener: (this: Document, e: DocumentEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ShadowRootEventMap>(target: ShadowRoot, event: E, listener: (this: ShadowRoot, e: ShadowRootEventMap[E]) => void, options?: UseEventListenerOptions): () => void

function useEventListener<E extends string>(target: EventTarget, event: E, listener: (this: EventTarget, e: Event) => void, options?: UseEventListenerOptions): () => void

function useEventListener<T extends EventTarget, M extends Record<string, any>, E extends keyof M>(target: T, event: E, listener: (this: T, e: M[E]) => void, options?: UseEventListenerOptions): () => void

/**
 * auto bind event listener when mounted and unbind when unmounted or disposed or if controlled
 * @param target event target
 * @param event event name
 * @param listener event listener callback
 * @param options event listener options
 * @returns cancel event listener
 */
function useEventListener(target: EventTarget, event: string, listener: (this: EventTarget, e: Event) => void, options?: UseEventListenerOptions): () => void {
  target.addEventListener(event, listener, options)

  const stop = (): void => {
    target.removeEventListener(event, listener, options)
  }

  tryOnScopeDispose(stop)

  return stop
}

export default useEventListener
