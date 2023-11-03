import { type Fn } from './util'

const map = new WeakMap()

/**
 * a model of hook
 * @param hook a vue composition hook
 * @param params the parameters that will passing to the hook
 * @returns the result of execute the hook using the passing parameters
 */
const useModel = <T extends Fn>(hook: T, params: Parameters<T>): ReturnType<T> => {
  if (!map.has(hook)) {
    map.set(hook, hook(params))
  }
  return map.get(hook)
}

export default useModel
