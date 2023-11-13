import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

interface UseCssVariableOptions {
  /**
   * the initial value for the specific CSS variable
   */
  initial?: string
}

/**
 * CSS variable controller hook
 * @param prop control CSS variable name
 * @param target control target element
 * @param options control options
 * @param options.initial the initial value for CSS variable
 * @returns controllable CSS variable value
 */
const useCssVariable = (prop: MaybeRefOrGetter<string>, target: MaybeRefOrGetter<HTMLElement | SVGElement | MathMLElement | null> = document.documentElement, options: UseCssVariableOptions = {}): Ref<string> => {
  const { initial = '' } = options

  const variable = ref(initial)

  watch(
    [() => toValue(prop), () => toValue(target)],
    ([prop, target]) => {
      variable.value = window
        .getComputedStyle(target ?? document.documentElement)
        .getPropertyValue(prop)
        .trim()
    },
    {
      immediate: true,
    }
  )

  watch(variable, (variable) => {
    toValue(target)?.style?.setProperty(toValue(prop), variable)
  })

  return variable
}

export default useCssVariable
