import { readonly, ref, type Ref, shallowRef, type ShallowRef, shallowReadonly } from 'vue'
import { tryOnScopeDispose, useEventListener } from '.'

interface UseBroadcastChannelReturn<D = unknown, P = D> {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * broadcast channel open status
   */
  isOpen: Readonly<Ref<boolean>>

  /**
   * broadcast channel transferred data
   */
  data: Readonly<Ref<D | null>>

  /**
   * broadcast channel transferred error
   */
  error: Readonly<ShallowRef<MessageEvent<D> | null>>

  /**
   * post data to the broadcast channel
   */
  post: (data: P) => void

  /**
   * close the broadcast channel
   */
  close: () => void
}

/**
 * reactive Broadcast Channel API
 * @param name broadcast channel name
 * @returns @see {@link UseBroadcastChannelReturn}
 */
const useBroadcastChannel = <D = unknown, P = D>(name: string): UseBroadcastChannelReturn<D, P> => {
  const isSupported = 'BroadcastChannel' in window

  const broadcastChannel = new BroadcastChannel(name)

  const isOpen = ref(true)

  const data: Ref<D | null> = ref(null)

  const error: ShallowRef<MessageEvent<D> | null> = shallowRef(null)

  const post = (data: P): void => {
    broadcastChannel.postMessage(data)
  }

  const close = (): void => {
    broadcastChannel.close()
    isOpen.value = false
  }

  useEventListener<BroadcastChannel, BroadcastChannelEventMap, 'message'>(broadcastChannel, 'message', (e) => {
    data.value = e.data
    error.value = null
  })

  useEventListener<BroadcastChannel, BroadcastChannelEventMap, 'messageerror'>(broadcastChannel, 'messageerror', (e) => {
    error.value = e
    data.value = null
  })

  tryOnScopeDispose(close)

  return {
    isSupported,
    isOpen: readonly(isOpen),
    data: readonly(data) as Readonly<Ref<D | null>>,
    error: shallowReadonly(error),
    post,
    close,
  }
}

export default useBroadcastChannel
