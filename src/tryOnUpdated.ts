import { getCurrentInstance, onUpdated } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a component, call it in `onUpdated` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnUpdated = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onUpdated(fn)
  }
}

export default tryOnUpdated
