import tryOnScopeDispose from './tryOnScopeDispose'
import { type Fn } from './util'

type MaybeArray<T> = T | T[]

type Listener<T extends EventTarget, E extends Event> = (this: T, e: E) => void

type UseEventListenerOptions = AddEventListenerOptions | EventListenerOptions | boolean

function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E, listener: MaybeArray<Listener<Window, WindowEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E, listener: MaybeArray<Listener<Document, DocumentEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ShadowRootEventMap>(target: ShadowRoot, event: E, listener: MaybeArray<Listener<ShadowRoot, ShadowRootEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ElementEventMap>(target: Element, event: E, listener: MaybeArray<Listener<Element, ElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof HTMLElementEventMap>(target: HTMLElement, event: E, listener: MaybeArray<Listener<HTMLElement, HTMLElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof SVGElementEventMap>(target: SVGElement, event: E, listener: MaybeArray<Listener<SVGElement, SVGElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof MathMLElementEventMap>(target: MathMLElement, event: E, listener: MaybeArray<Listener<MathMLElement, MathMLElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends string>(target: EventTarget, event: E, listener: MaybeArray<Listener<EventTarget, Event>>, options?: UseEventListenerOptions): () => void

function useEventListener<T extends EventTarget, M extends Record<string, any>, E extends keyof M>(target: T, event: E, listener: MaybeArray<Listener<T, M[E]>>, options?: UseEventListenerOptions): () => void

/**
 * auto bind event listener when mounted and unbind when unmounted or disposed or if as controlled
 * @param target event target
 * @param event event name(s)
 * @param listener event listener callback(s)
 * @param options event listener options
 * @returns cancel event listener
 */
function useEventListener(
  target: EventTarget,
  event: string,
  listener: MaybeArray<Fn>,
  options: UseEventListenerOptions = {
    passive: true,
  }
): () => void {
  if (!Array.isArray(listener)) {
    listener = [listener]
  }

  listener.forEach((l) => {
    target.addEventListener(event, l, options)
  })

  const stop = (): void => {
    if (!Array.isArray(listener)) {
      listener = [listener]
    }

    listener.forEach((l) => {
      target.removeEventListener(event, l, options)
    })
  }

  tryOnScopeDispose(stop)

  return stop
}

export default useEventListener
