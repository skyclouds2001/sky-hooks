import { type Fn } from '.'

const map = new WeakMap()

const useModel = <T extends Fn>(hook: T, params: Parameters<T>): ReturnType<T> => {
  if (!map.has(hook)) {
    map.set(hook, hook(params))
  }
  return map.get(hook)
}

export default useModel
