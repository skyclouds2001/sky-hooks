import { computed, readonly, ref, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { type Obj } from './util'

type StepperArray = Array<string | number>

type StepperObject = Obj

type Stepper = StepperArray | StepperObject

interface UseStepperOptions<N> {
  /**
   * the initial value of the counter
   */
  initial?: N
}

interface UseStepperReturn<SS, S> {
  /**
   * the steps of the stepper
   */
  steps: Readonly<Ref<SS>>

  /**
   * the step keys of the counter
   */
  stepNames: ComputedRef<Array<string | number>>

  /**
   * the steps count of the counter
   */
  stepCount: ComputedRef<number>

  /**
   * the current index of the counter
   */
  index: Ref<number>

  /**
   * the previous value of the counter
   */
  previous: ComputedRef<S | undefined>

  /**
   * the current value of the counter
   */
  current: ComputedRef<S | undefined>

  /**
   * the next value of the counter
   */
  next: ComputedRef<S | undefined>

  /**
   * whether current value is the first value of the counter
   */
  isFirst: ComputedRef<boolean>

  /**
   * whether current value is the first value of the counter
   */
  isLast: ComputedRef<boolean>

  /**
   * get the value of the specific index
   */
  at: (index: number) => S | undefined

  /**
   * get the value of the specific key
   */
  get: (name: string) => S | undefined

  /**
   * change the current value to the previous value
   */
  goToPrevious: () => void

  /**
   * change the current value to the specific value of the key
   */
  goTo: (name: string) => void

  /**
   * change the current value to the next value
   */
  goToNext: () => void

  /**
   * whether the value of the specific key is the previous value
   */
  isPrevious: (name: string) => boolean

  /**
   * whether the value of the specific key is the current value
   */
  isCurrent: (name: string) => boolean

  /**
   * whether the value of the specific key is the next value
   */
  isNext: (name: string) => boolean

  /**
   * whether the value of the specific key is before the current value
   */
  isBefore: (name: string) => boolean

  /**
   * whether the value of the specific key is after the current value
   */
  isAfter: (name: string) => boolean
}

/**
 * hook for stepper
 * @param steps steps
 * @param options @see {@link UseStepperOptions}
 * @returns @see {@link UseStepperReturn}
 */
const useStepper = <Steppers extends Stepper, Value = Steppers extends Array<infer S> ? S : Steppers extends Record<string, infer R> ? R : never, Key = Steppers extends Array<infer S> ? S : keyof Steppers>(steps: MaybeRefOrGetter<Steppers>, options: UseStepperOptions<Key> = {}): UseStepperReturn<Steppers, Value> => {
  const { initial } = options

  const step = ref(toValue(steps)) as Ref<Steppers>

  const stepNames = computed(() => (Array.isArray(step.value) ? step.value : Object.keys(step.value)))
  const stepCount = computed(() => stepNames.value.length)

  const index = ref(stepNames.value.indexOf(initial ?? stepNames.value[0]))

  const previous = computed(() => at(index.value - 1))
  const current = computed(() => at(index.value))
  const next = computed(() => at(index.value + 1))
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === stepCount.value - 1)

  const at = (index: number): Value | undefined => (Array.isArray(step.value) ? step.value[index] : step.value[stepNames.value[index]])
  const get = (name: string): Value | undefined => (stepNames.value.includes(name) ? at(stepNames.value.indexOf(name)) : undefined)

  const goToPrevious = (): void => {
    if (!isFirst.value) {
      --index.value
    }
  }
  const goTo = (name: string): void => {
    const id = stepNames.value.indexOf(name)
    if (id !== -1) {
      index.value = id
    }
  }
  const goToNext = (): void => {
    if (!isLast.value) {
      ++index.value
    }
  }

  const isPrevious = (name: string): boolean => {
    const id = stepNames.value.indexOf(name)
    return id === index.value - 1 && id !== -1
  }
  const isCurrent = (name: string): boolean => {
    const id = stepNames.value.indexOf(name)
    return id === index.value && id !== -1
  }
  const isNext = (name: string): boolean => {
    const id = stepNames.value.indexOf(name)
    return id === index.value + 1 && id !== -1
  }
  const isBefore = (name: string): boolean => {
    const id = stepNames.value.indexOf(name)
    return id < index.value && id !== -1
  }
  const isAfter = (name: string): boolean => {
    const id = stepNames.value.indexOf(name)
    return id > index.value && id !== -1
  }

  return {
    steps: readonly(step) as Readonly<Ref<Steppers>>,
    stepNames,
    stepCount,
    index,
    previous,
    current,
    next,
    isFirst,
    isLast,
    at,
    get,
    goToPrevious,
    goTo,
    goToNext,
    isPrevious,
    isCurrent,
    isNext,
    isBefore,
    isAfter,
  }
}

export default useStepper
