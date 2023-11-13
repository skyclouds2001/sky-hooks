import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

interface UseWebSocketOptions {
  /**
   * the protocols of WebSocket server, will pass to `WebSocket()` constructor as the second parameters
   */
  protocols?: string | string[]

  /**
   * whether immediately create WebSocket server
   * @default true
   */
  immediate?: boolean

  /**
   * whether auto close WebSocket server when scope dispose
   * @default true
   */
  autoClose?: boolean

  /**
   * whether auto reconnect if the connection lost
   * @default true
   */
  autoReconnect?:
    | boolean
    | {
        /**
         * the retry times to create WebSocket server
         * @default Infinity
         */
        retries?: number

        /**
         * the delay time to re-create WebSocket server
         * @default 1000
         */
        delay?: number
      }

  /**
   * whether to make heartbeat pings
   * @default false
   */
  heartbeat?:
    | boolean
    | {
        /**
         * the retry times to create WebSocket server
         * @default 'ping'
         */
        message?: string

        /**
         * the delay time to re-create WebSocket server
         * @default 1000
         */
        interval?: number
      }
}

interface UseWebSocketReturn<D> {
  /**
   * the WebSocket instance
   */
  websocket: ShallowRef<WebSocket | null>

  /**
   * the most recent data sent from the remote WebSocket server
   */
  data: Ref<D | null>

  /**
   * the most recent error of the WebSocket server, if any
   */
  error: ShallowRef<Event | null>

  /**
   * the WebSocket server status
   */
  status: Ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>

  /**
   * open the WebSocket server
   */
  open: () => void

  /**
   * close the WebSocket server
   * @param code server close code, must be an integer between 3000 and 4999 or 1000
   * @param reason server close reason
   */
  close: (code?: number, reason?: string) => void

  /**
   * send a message through the WebSocket server
   * @param message message to be sent to the remote
   */
  send: (message: D) => void
}

/**
 * reactive WebSocket
 * @param url WebSocket url
 * @param options @see {@link UseWebSocketOptions}
 * @returns @see {@link UseWebSocketReturn}
 */
const useWebSocket = <D extends string | Blob | ArrayBufferLike | ArrayBufferView = string>(url: string | URL, options: UseWebSocketOptions = {}): UseWebSocketReturn<D> => {
  const { protocols, immediate = true, autoClose = true, autoReconnect = true, heartbeat = false } = options

  const websocket = shallowRef<WebSocket | null>(null)

  const data: Ref<D | null> = ref(null)

  const error = shallowRef<Event | null>(null)

  const status = ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>(WebSocket.CLOSED)

  let manualClose = false
  let retry = 0
  let id: number | null = null

  const open = (): void => {
    if (websocket.value != null || status.value !== WebSocket.CLOSED) return

    const ws = new WebSocket(url, protocols)

    status.value = WebSocket.CONNECTING
    websocket.value = ws

    manualClose = false
    retry = 0

    ws.addEventListener(
      'open',
      () => {
        status.value = WebSocket.OPEN
        error.value = null

        if (heartbeat !== false) {
          const { message = 'ping', interval = 1000 } = typeof heartbeat === 'object' ? heartbeat : {}

          id = window.setInterval(() => {
            send(message as D)
          }, interval)
        }
      },
      {
        passive: true,
      }
    )

    ws.addEventListener(
      'close',
      () => {
        status.value = WebSocket.CLOSED
        websocket.value = null

        if (!manualClose && autoReconnect !== false) {
          const { retries = Infinity, delay = 1000 } = typeof autoReconnect === 'object' ? autoReconnect : {}

          if (Number.isFinite(retries) || retry < retries) {
            window.setTimeout(open, delay)
          }

          ++retry
        }

        if (heartbeat !== false && id != null) {
          window.clearInterval(id)
          id = null
        }

        manualClose = false
      },
      {
        passive: true,
      }
    )

    ws.addEventListener(
      'error',
      (e) => {
        error.value = e
      },
      {
        passive: true,
      }
    )

    ws.addEventListener(
      'message',
      (e) => {
        if (heartbeat !== false) {
          const { message = 'ping' } = typeof heartbeat === 'object' ? heartbeat : {}

          if (e.data === message) {
            return
          }
        }

        data.value = e.data
      },
      {
        passive: true,
      }
    )
  }

  const close = (code?: number, reason?: string): void => {
    if (websocket.value == null) return

    websocket.value.close(code, reason)
    websocket.value = null
    status.value = WebSocket.CLOSING

    manualClose = true
  }

  const send = (message: D): void => {
    if (websocket.value == null || status.value !== WebSocket.OPEN) return

    websocket.value.send(message)
  }

  if (immediate) {
    open()
  }

  if (autoClose) {
    tryOnScopeDispose(close)
  }

  return {
    websocket,
    data,
    error,
    status,
    open,
    close,
    send,
  }
}

export default useWebSocket
