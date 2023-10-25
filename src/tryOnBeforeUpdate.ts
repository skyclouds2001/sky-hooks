import { getCurrentInstance, onBeforeUpdate } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a component, call it in `onBeforeUpdate` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnBeforeUpdate = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onBeforeUpdate(fn)
  }
}

export default tryOnBeforeUpdate
