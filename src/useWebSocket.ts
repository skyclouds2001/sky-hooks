import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

const useWebSocket = <D extends string | ArrayBuffer | Blob = string>(
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
  } = {}
): {
  websocket: ShallowRef<WebSocket | null>
  data: Ref<D | null>
  status: Ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>
  open: () => void
  close: (code?: number, reason?: string) => void
  send: (message: D) => void
} => {
  const { immediate = true, autoClose = true, protocols, autoReconnect } = options

  const websocket = shallowRef<WebSocket | null>(null)

  const data: Ref<D | null> = ref(null)

  const error = shallowRef<Event | null>(null)

  const status = ref<WebSocket['CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED']>(WebSocket.CLOSED)

  let manualClose = false
  let retry = 0

  const open = (): void => {
    if (websocket.value !== null || status.value === WebSocket.OPEN) return

    const ws = new WebSocket(url, protocols)

    manualClose = false
    retry = 0

    ws.addEventListener(
      'open',
      () => {
        status.value = WebSocket.OPEN
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

        if (!manualClose && autoReconnect !== undefined) {
          const { retries = Infinity, delay = 1000 } = typeof autoReconnect === 'object' ? autoReconnect : {}

          if (Number.isFinite(retries) || retry < retries) {
            setTimeout(open, delay)
          }

          ++retry
        }
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
    if (websocket.value === null) return

    websocket.value.close(code, reason)
    status.value = WebSocket.CLOSING

    manualClose = true
  }

  const send = (message: D): void => {
    if (websocket.value === null || status.value !== WebSocket.OPEN) return

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
