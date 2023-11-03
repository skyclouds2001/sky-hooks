import { readonly, ref, type DeepReadonly, type Ref } from 'vue'

const useDevicePixelRatio = (): DeepReadonly<Ref<number>> => {
  const pixelRatio = ref(1)

  const update = (): void => {
    pixelRatio.value = window.devicePixelRatio

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)

    media.addEventListener('change', update, {
      passive: true,
      once: true,
    })
  }

  update()

  return readonly(pixelRatio)
}

export default useDevicePixelRatio
