import { getCurrentScope, onScopeDispose } from 'vue'
import { type Fn } from '.'

/**
 * if the callback function is called in a scope, call it in `onScopeDispose` hook, otherwise do not call it
 * @param fn callback function
 */
const tryOnScopeDispose = (fn: Fn): void => {
  if (getCurrentScope() !== undefined) {
    onScopeDispose(fn)
  }
}

export default tryOnScopeDispose
