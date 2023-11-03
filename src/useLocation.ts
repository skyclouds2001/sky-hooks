import { reactive, readonly, type DeepReadonly } from 'vue'
import useEventListener from './useEventListener'

interface BrowserLocation {
  trigger: 'load' | 'hashchange' | 'popstate'
  length: number
  state: any
  hash: string
  host: string
  hostname: string
  href: string
  origin: string
  pathname: string
  port: string
  protocol: string
  search: string
}

const useLocation = (): DeepReadonly<BrowserLocation> => {
  const location = reactive<BrowserLocation>({
    trigger: 'load',
    length: 0,
    state: null,
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

  useEventListener(
    window,
    'hashchange',
    () => {
      update('hashchange')
    },
    {
      passive: true,
    }
  )

  useEventListener(
    window,
    'popstate',
    () => {
      update('popstate')
    },
    {
      passive: true,
    }
  )

  return readonly(location)
}

export default useLocation
