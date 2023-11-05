import { reactive, readonly, type DeepReadonly } from 'vue'
import useEventListener from './useEventListener'

type BrowserLocation = Writable<
  {
    trigger: 'load' | 'hashchange' | 'popstate'
    ancestorOrigins: string[]
  } & Pick<History, 'length' | 'state'> &
    Pick<Location, 'hash' | 'host' | 'hostname' | 'href' | 'origin' | 'pathname' | 'port' | 'protocol' | 'search'>
>

/**
 * reactive web location
 * @returns location information
 */
const useLocation = (): DeepReadonly<BrowserLocation> => {
  const location: BrowserLocation = reactive({
    trigger: 'load',
    length: 0,
    state: null,
    ancestorOrigins: [],
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
  })

  const update = (trigger: 'load' | 'hashchange' | 'popstate'): void => {
    location.trigger = trigger
    location.length = window.history.length
    location.state = window.history.state
    location.ancestorOrigins = Array.from(window.location.ancestorOrigins)
    location.hash = window.location.hash
    location.host = window.location.host
    location.hostname = window.location.hostname
    location.href = window.location.href
    location.origin = window.location.origin
    location.pathname = window.location.pathname
    location.port = window.location.port
    location.protocol = window.location.protocol
    location.search = window.location.search
  }

  update('load')

  useEventListener(window, 'hashchange', () => {
    update('hashchange')
  })

  useEventListener(window, 'popstate', () => {
    update('popstate')
  })

  return readonly(location)
}

export default useLocation
