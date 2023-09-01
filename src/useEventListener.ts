import { getCurrentScope, onScopeDispose } from 'vue'

type MaybeArray<T> = T | T[]

type Listener<T extends EventTarget, E extends Event> = (this: T, e: E) => void

type UseEventListenerOptions = AddEventListenerOptions | EventListenerOptions | boolean

function useEventListener<E extends keyof WindowEventMap>(target: Window, event: MaybeArray<E>, listener: Listener<Window, WindowEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: MaybeArray<E>, listener: Listener<Document, DocumentEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ShadowRootEventMap>(target: ShadowRoot, event: MaybeArray<E>, listener: Listener<ShadowRoot, ShadowRootEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ElementEventMap>(target: Element, event: MaybeArray<E>, listener: Listener<Element, ElementEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof HTMLElementEventMap>(target: HTMLElement, event: MaybeArray<E>, listener: Listener<HTMLElement, HTMLElementEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof SVGElementEventMap>(target: SVGElement, event: MaybeArray<E>, listener: Listener<SVGElement, SVGElementEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof MathMLElementEventMap>(target: MathMLElement, event: MaybeArray<E>, listener: Listener<MathMLElement, MathMLElementEventMap[E]>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends string>(target: EventTarget, event: MaybeArray<E>, listener: Listener<EventTarget, Event>, options?: UseEventListenerOptions): () => void

function useEventListener<T extends EventTarget, M extends Record<string, any>, E extends keyof M>(target: T, event: MaybeArray<E>, listener: Listener<T, M[E]>, options?: UseEventListenerOptions): () => void

function useEventListener(target: EventTarget, event: MaybeArray<string>, listener: Listener<EventTarget, Event>, options?: UseEventListenerOptions): () => void {
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
