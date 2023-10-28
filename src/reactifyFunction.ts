import { computed, type ComputedRef, type Ref, unref } from 'vue'
import { type Fn } from '.'

type Reactify<T> = T extends (...args: infer A) => infer R
  ? (
      ...args: {
        [K in keyof A]: A[K] | Ref<A[K]>
      }
    ) => ComputedRef<R>
  : never

/**
 * transform a function to a reactive function, that is, support passing ref or getter as parameters and return a computed ref
 * @param fn the source function
 * @returns the target function
 */
const reactifyFunction = function <T extends Fn>(fn: T): Reactify<T> {
  return function (this: ThisType<T>, ...args: Parameters<T>) {
    return computed(() =>
      fn.apply(
        this,
        args.map((v) => unref(v))
      )
    )
  } as unknown as Reactify<T>
}

export default reactifyFunction
