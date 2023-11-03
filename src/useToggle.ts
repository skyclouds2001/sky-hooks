import { readonly, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

interface UseToggleOptions<T, F> {
  /**
   * the truthy value
   * @default true
   */
  truthy?: MaybeRefOrGetter<T>

  /**
   * the falsy value
   * @default false
   */
  falsy?: MaybeRefOrGetter<F>

  /**
   * the initial value, must be one of truthy value or falsy value
   * @default options.falsy
   */
  initial?: T | F
}

interface UseToggleReturn<T, F> {
  /**
   * the value of the toggle
   */
  value: Readonly<Ref<T | F>>

  /**
   * toggle the value of the toggle
   * @param val the optional parameter used to change the value, must be one of the truthy value or falsy value
   */
  toggle: (val?: T | F) => void
}

/**
 * hook for toggle value
 * @param options @see {@link UseToggleOptions}
 * @returns @see {@link UseToggleReturn}
 */
const useToggle = <T = true, F = false>(options: UseToggleOptions<T, F> = {}): UseToggleReturn<T, F> => {
  const { truthy = true as MaybeRefOrGetter<T>, falsy = false as MaybeRefOrGetter<F>, initial = toValue(falsy) } = options

  const value = ref(initial) as Ref<T | F>

  const toggle = (val?: T | F): void => {
    if (val !== undefined) {
      value.value = val
    } else {
      value.value = value.value === toValue(truthy) ? toValue(falsy) : toValue(truthy)
    }
  }

  watch(
    () => toValue(truthy),
    (cur, pre) => {
      if (value.value === pre) {
        value.value = cur
      }
    }
  )

  watch(
    () => toValue(falsy),
    (cur, pre) => {
      if (value.value === pre) {
        value.value = cur
      }
    }
  )

  return {
    value: readonly(value) as Readonly<Ref<T | F>>,
    toggle,
  }
}

export default useToggle
