import { getCurrentInstance, onDeactivated } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a component, call it in `onDeactivated` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnDeactivated = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onDeactivated(fn)
  }
}

export default tryOnDeactivated
