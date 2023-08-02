import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

const useOnline = (): {
  isOnline: Readonly<Ref<boolean>>
  onlineAt: Readonly<Ref<number | undefined>>
  offlineAt: Readonly<Ref<number | undefined>>
} => {
  const isOnline = ref(window.navigator.onLine)

  const onlineAt = ref(isOnline.value ? Date.now() : undefined)

  const offlineAt = ref(isOnline.value ? undefined : Date.now())

  useEventListener(
    window,
    'online',
    () => {
      isOnline.value = true
      onlineAt.value = isOnline.value ? Date.now() : undefined
    },
    {
      passive: true,
    }
  )

  useEventListener(
    window,
    'offline',
    () => {
      isOnline.value = false
      offlineAt.value = isOnline.value ? undefined : Date.now()
    },
    {
      passive: true,
    }
  )

  return {
    isOnline: readonly(isOnline),
    onlineAt: readonly(onlineAt),
    offlineAt: readonly(offlineAt),
  }
}

export default useOnline
