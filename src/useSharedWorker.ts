import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

interface UseSharedWorkerReturn<D> {
  /**
   * worker that currently controls
   */
  worker: ShallowRef<SharedWorker | null>

  /**
   * recently active data
   */
  data: Ref<D | null>

  /**
   * worker running error, if any
   */
  error: ShallowRef<Error | null>

  /**
   * post message to the worker
   */
  postMessage: (message: D) => void

  /**
   * start the worker
   */
  start: () => void

  /**
   * close the worker
   */
  close: () => void
}

/**
 * reactive Web Worker API for Shared Worker
 * @param source Web Worker source file URL
 * @param options Web Worker options
 * @returns @see {@link UseSharedWorkerReturn}
 */
const useSharedWorker = <D = any>(source: string | URL, options: string | WorkerOptions): UseSharedWorkerReturn<D> => {
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
