import { tryOnScopeDispose } from '.'

type MaybeArray<T> = T | T[]

type Listener<T extends EventTarget = EventTarget, E extends Event = Event> = (this: T, e: E) => void

type UseEventListenerOptions = AddEventListenerOptions | EventListenerOptions | boolean

function useEventListener<E extends keyof WindowEventMap>(target: Window, event: MaybeArray<E>, listener: MaybeArray<Listener<Window, WindowEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: MaybeArray<E>, listener: MaybeArray<Listener<Document, DocumentEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ShadowRootEventMap>(target: ShadowRoot, event: MaybeArray<E>, listener: MaybeArray<Listener<ShadowRoot, ShadowRootEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof ElementEventMap>(target: Element, event: MaybeArray<E>, listener: MaybeArray<Listener<Element, ElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof HTMLElementEventMap>(target: HTMLElement, event: MaybeArray<E>, listener: MaybeArray<Listener<HTMLElement, HTMLElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof SVGElementEventMap>(target: SVGElement, event: MaybeArray<E>, listener: MaybeArray<Listener<SVGElement, SVGElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends keyof MathMLElementEventMap>(target: MathMLElement, event: MaybeArray<E>, listener: MaybeArray<Listener<MathMLElement, MathMLElementEventMap[E]>>, options?: UseEventListenerOptions): () => void

function useEventListener<E extends string>(target: EventTarget, event: MaybeArray<E>, listener: MaybeArray<Listener<EventTarget, Event>>, options?: UseEventListenerOptions): () => void

function useEventListener<T extends EventTarget, M extends Record<string, any>, E extends keyof M>(target: T, event: MaybeArray<E>, listener: MaybeArray<Listener<T, M[E]>>, options?: UseEventListenerOptions): () => void

/**
 * auto bind event listener when mounted and unbind when unmounted or disposed or if as controlled
 * @param target event target
 * @param event event name(s)
 * @param listener event listener callback(s)
 * @param options event listener options
 * @returns cancel event listener
 */
function useEventListener(target: EventTarget, event: MaybeArray<string>, listener: MaybeArray<Listener<EventTarget, Event>>, options?: UseEventListenerOptions): () => void {
  if (!Array.isArray(event)) {
    event = [event]
  }
  if (!Array.isArray(listener)) {
    listener = [listener]
  }

  event.forEach((e) => {
    ;(listener as Listener[]).forEach((l) => {
      target.addEventListener(e, l, options)
    })
  })

  const stop = (): void => {
    ;(event as string[]).forEach((e) => {
      ;(listener as Listener[]).forEach((l) => {
        target.removeEventListener(e, l, options)
      })
    })
  }

  tryOnScopeDispose(stop)

  return stop
}

export default useEventListener
