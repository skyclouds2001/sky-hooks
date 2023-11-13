import { getCurrentInstance, onMounted } from 'vue'
import { type Fn } from './util'

/**
 * if the callback function is called in a component, call it in `onMounted` hook, otherwise call it immediately
 * @param fn callback function
 */
const tryOnMounted = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onMounted(fn)
  } else {
    fn()
  }
}

export default tryOnMounted
