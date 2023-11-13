import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'

/**
 * reactive base64 encode
 * @param target encode target
 * @returns encode result
 */
const useBase64 = (target: MaybeRefOrGetter<undefined | null | string | unknown[] | Blob | File | ArrayBuffer | HTMLImageElement | HTMLCanvasElement>): DeepReadonly<Ref<string>> => {
  const base64 = ref('')

  const encoder = new TextEncoder()

  const reader = new FileReader()

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  watch(
    () => toValue(target),
    (target) => {
      if (target == null) {
        base64.value = ''
      } else if (typeof target === 'string') {
        base64.value = window.btoa(String.fromCharCode(...encoder.encode(target)))
      } else if (Array.isArray(target)) {
        base64.value = window.btoa(String.fromCharCode(...encoder.encode(JSON.stringify(target))))
      } else if (target instanceof Set) {
        base64.value = window.btoa(String.fromCharCode(...encoder.encode(JSON.stringify(Array.from(target)))))
      } else if (target instanceof Map) {
        base64.value = window.btoa(String.fromCharCode(...encoder.encode(JSON.stringify(Object.fromEntries(target)))))
      } else if (target instanceof ArrayBuffer) {
        base64.value = window.btoa(String.fromCharCode(...new Uint8Array(target)))
      } else if (target instanceof Blob) {
        reader.onload = (e) => {
          base64.value = e.target?.result as string
        }
        reader.onerror = () => {
          base64.value = ''
        }
        reader.readAsDataURL(target)
      } else if (target instanceof HTMLImageElement) {
        const img = target.cloneNode() as HTMLImageElement
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          try {
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img, 0, 0, canvas.width, canvas.height)
            base64.value = canvas.toDataURL()
            context.clearRect(0, 0, canvas.width, canvas.height)
          } catch {
            base64.value = ''
          }
        }
        img.onerror = () => {
          base64.value = ''
        }
      } else if (target instanceof HTMLCanvasElement) {
        try {
          base64.value = target.toDataURL()
        } catch {
          base64.value = ''
        }
      } else {
        base64.value = window.btoa(String.fromCharCode(...encoder.encode(JSON.stringify(target))))
      }
    },
    {
      immediate: true,
    }
  )

  return readonly(base64)
}

export default useBase64
