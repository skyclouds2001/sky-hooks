import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

const useWebSocket = <D extends string | Blob | ArrayBufferLike | ArrayBufferView = string>(
  url: string | URL,
  options: {
    immediate?: boolean
    autoClose?: boolean
    protocols?: string | string[]
    autoReconnect?:
      | boolean
      | {
          retries?: number
          delay?: number
        }
    heartbeat?:
      | boolean
      | {
          message?: string
          interval?: number
        }
  } = {}
): {
  websocket: ShallowRef<WebSocket | null>
  data: Ref<D | null>
  status: Ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>
  open: () => void
  close: (code?: number, reason?: string) => void
  send: (message: D) => void
} => {
  const { immediate = true, autoClose = true, protocols, autoReconnect = true, heartbeat = false } = options

  const websocket = shallowRef<WebSocket | null>(null)

  const data: Ref<D | null> = ref(null)

  const error = shallowRef<Event | null>(null)

  const status = ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>(WebSocket.CLOSED)

  let manualClose = false
  let retry = 0
  let id: number | null = null

  const open = (): void => {
    if (websocket.value != null || status.value === WebSocket.OPEN) return

    const ws = new WebSocket(url, protocols)

    manualClose = false
    retry = 0

    ws.addEventListener(
      'open',
      () => {
        status.value = WebSocket.OPEN

        if (heartbeat) {
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

        if (!manualClose && !!autoReconnect) {
          const { retries = Infinity, delay = 1000 } = typeof autoReconnect === 'object' ? autoReconnect : {}

          if (Number.isFinite(retries) || retry < retries) {
            window.setTimeout(open, delay)
          }

          ++retry
        }
        
        if (heartbeat && id != null) {
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
        if (heartbeat) {
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

    status.value = WebSocket.CONNECTING
    websocket.value = ws
  }

  const close = (code?: number, reason?: string): void => {
    if (websocket.value == null) return

    websocket.value.close(code, reason)
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
    status,
    open,
    close,
    send,
  }
}

export default useWebSocket
