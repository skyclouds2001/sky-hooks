import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

interface UseWebWorkerReturn<D> {
  /**
   * worker that currently controls
   */
  worker: ShallowRef<Worker | null>

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
   * terminate the worker
   */
  terminate: () => void
}

/**
 * reactive Web Worker API for Dedicated Worker
 * @param source Web Worker source file URL
 * @param options Web Worker options
 * @returns @see {@link UseWebWorkerReturn}
 */
const useWebWorker = <D = any>(source: string | URL, options: WorkerOptions): UseWebWorkerReturn<D> => {
  const worker = shallowRef<Worker>(new window.Worker(source, options))

  const data: Ref<D | null> = ref(null)

  const error = shallowRef<Error | null>(null)

  const postMessage = (message: D): void => {
    worker.value?.postMessage(message)
  }

  const terminate = (): void => {
    worker.value?.terminate()
  }

  worker.value?.addEventListener(
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
    worker.value?.terminate()
  })

  return {
    worker,
    data,
    error,
    postMessage,
    terminate,
  }
}

export default useWebWorker
