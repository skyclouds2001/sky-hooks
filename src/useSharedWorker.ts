import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

const useSharedWorker = <D = any>(
  source: string | URL,
  options: string | WorkerOptions
): {
  worker: ShallowRef<SharedWorker | null>
  data: Ref<D | null>
  error: ShallowRef<Error | null>
  postMessage: (message: D) => void
  start: () => void
  close: () => void
} => {
  const worker = shallowRef<SharedWorker>(new window.SharedWorker(source, options))

  const data: Ref<D | null> = ref(null)

  const error = shallowRef<Error | null>(null)

  const postMessage = (message: D): void => {
    worker.value?.port.postMessage(message)
  }

  const start = (): void => {
    worker.value?.port.start()
  }

  const close = (): void => {
    worker.value?.port.close()
  }

  worker.value?.port.addEventListener(
    'message',
    (e) => {
      data.value = e.data
    },
    {
      passive: true,
    }
  )

  worker.value?.addEventListener(
    'error',
    (e) => {
      error.value = e.error
    },
    {
      passive: true,
    }
  )

  tryOnScopeDispose(() => {
    worker.value?.port.close()
  })

  return {
    worker,
    data,
    error,
    postMessage,
    start,
    close,
  }
}

export default useSharedWorker
