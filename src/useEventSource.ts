import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

interface UseEventSourceOptions {
  /**
   * whether Cross-Origin Resource Sharing should include credentials, will pass to `EventSource()` constructor as the second parameters
   * @default false
   */
  withCredentials?: boolean

  /**
   * whether immediately create EventSource server
   * @default true
   */
  immediate?: boolean

  /**
   * whether auto close EventSource server when scope dispose
   * @default true
   */
  autoClose?: boolean
}

interface UseEventSourceReturn {
  /**
   * the EventSource instance
   */
  eventsource: ShallowRef<EventSource | null>

  /**
   * the most recent event name sent from the remote EventSource server
   */
  event: Ref<string | null>

  /**
   * the most recent message sent from the remote EventSource server
   */
  message: Ref<string | null>

  /**
   * the most recent error of the EventSource server, if any
   */
  error: ShallowRef<Event | null>

  /**
   * the EventSource server status
   */
  status: Ref<EventSource['CONNECTING' | 'OPEN' | 'CLOSED']>

  /**
   * open the EventSource server
   */
  open: () => void

  /**
   * close the EventSource server
   */
  close: () => void
}

/**
 * reactive EventSource
 * @param url EventSource url
 * @param events events to listen
 * @param options @see {@link UseEventSourceOptions}
 * @returns @see {@link UseEventSourceReturn}
 */
const useEventSource = (url: string | URL, events: string[] = [], options: UseEventSourceOptions = {}): UseEventSourceReturn => {
  const { withCredentials = false, immediate = true, autoClose = true } = options

  const eventsource = shallowRef<EventSource | null>(null)

  const event = ref<string | null>(null)

  const message = ref<string | null>(null)

  const error = shallowRef<Event | null>(null)

  const status = ref<EventSource['CONNECTING' | 'OPEN' | 'CLOSED']>(EventSource.CLOSED)

  const open = (): void => {
    if (eventsource.value !== null || eventsource.value !== EventSource.CLOSED) return

    const es = new EventSource(url, {
      withCredentials,
    })

    status.value = EventSource.CONNECTING
    eventsource.value = es

    es.addEventListener(
      'open',
      () => {
        status.value = EventSource.OPEN
        error.value = null
      },
      {
        passive: true,
      }
    )

    es.addEventListener(
      'error',
      (e) => {
        status.value = EventSource.CLOSED
        error.value = e
      },
      {
        passive: true,
      }
    )

    es.addEventListener(
      'message',
      (e) => {
        message.value = e.data
        event.value = 'message'
      },
      {
        passive: true,
      }
    )

    events.forEach((ev) => {
      es.addEventListener(
        ev,
        (e) => {
          message.value = e.data
          event.value = ev
        },
        {
          passive: true,
        }
      )
    })
  }

  const close = (): void => {
    if (eventsource.value === null || status.value === EventSource.CLOSED) return

    eventsource.value.close()
    eventsource.value = null
    status.value = EventSource.CLOSED
  }

  if (immediate) {
    open()
  }

  if (autoClose) {
    tryOnScopeDispose(close)
  }

  return {
    eventsource,
    event,
    message,
    status,
    error,
    open,
    close,
  }
}

export default useEventSource
