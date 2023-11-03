import { getCurrentInstance, onBeforeMount } from 'vue'
import { type Fn } from './util'

/**
 * if the callback function is called in a component, call it in `onBeforeMount` hook, otherwise call it immediately
 * @param fn callback function
 */
const tryOnBeforeMount = (fn: Fn): void => {
  if (getCurrentInstance() !== null) {
    onBeforeMount(fn)
  } else {
    fn()
  }
}

export default tryOnBeforeMount
