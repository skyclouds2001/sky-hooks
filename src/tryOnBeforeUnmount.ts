import { getCurrentInstance, onBeforeUnmount } from 'vue'
import { type Fn } from './util'

/**
 * if the callback function is called in a component, call it in `onBeforeUnmount` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnBeforeUnmount = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onBeforeUnmount(fn)
  }
}

export default tryOnBeforeUnmount
