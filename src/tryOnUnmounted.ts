import { getCurrentInstance, onUnmounted } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a component, call it in `onUnmounted` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnUnmounted = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onUnmounted(fn)
  }
}

export default tryOnUnmounted
