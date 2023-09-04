import { ref, type Ref, shallowRef, type ShallowRef } from 'vue'
import { tryOnScopeDispose } from '.'

const useWebWorker = <D = any>(
  source: string | URL,
  options: WorkerOptions
): {
  worker: ShallowRef<Worker | null>
  data: Ref<D | null>
  error: ShallowRef<Error | null>
  postMessage: (message: D) => void
  terminate: () => void
} => {
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
