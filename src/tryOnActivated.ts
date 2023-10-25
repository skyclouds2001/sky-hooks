import { getCurrentInstance, onActivated } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a component, call it in `onActivated` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnActivated = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onActivated(fn)
  }
}

export default tryOnActivated
