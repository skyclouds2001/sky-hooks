/* eslint-disable */

interface CookieStoreEventMap {
  change: CookieChangeEvent
}

interface CookieStore extends EventTarget {
  get(name: string): Promise<CookieListItem | undefined>
  get(options?: CookieStoreGetOptions): Promise<CookieListItem | undefined>

  getAll(name: string): Promise<CookieList>
  getAll(options?: CookieStoreGetOptions): Promise<CookieList>

  set(name: string, value: string): Promise<undefined>
  set(options: CookieInit): Promise<undefined>

  delete(name: string): Promise<undefined>
  delete(options: CookieStoreDeleteOptions): Promise<undefined>

  onchange: ((this: CookieStore, ev: CookieChangeEvent) => any) | null

  addEventListener: <K extends keyof CookieStoreEventMap>(type: K, listener: (this: CookieStore, ev: CookieStoreEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof CookieStoreEventMap>(type: K, listener: (this: CookieStore, ev: CookieStoreEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var CookieStore: {
  prototype: CookieStore
}

interface CookieStoreGetOptions {
  name: string
  url: string
}

type CookieSameSite = 'strict' | 'lax' | 'none'

interface CookieInit {
  name: string
  value: string
  expires?: DOMHighResTimeStamp | null
  domain?: string | null
  path?: string
  sameSite?: CookieSameSite
  partitioned?: boolean
}

interface CookieStoreDeleteOptions {
  name: string
  domain?: string | null
  path?: string
  partitione?: boolean
}

interface CookieListItem {
  name: string
  value: string
  domain?: string
  path: string
  expires?: DOMHighResTimeStamp
  secure: boolean
  sameSite: CookieSameSite
  partitioned: boolean
}

type CookieList = Array<CookieListItem>

interface CookieStoreManager {
  subscribe(subscriptions: Array<CookieStoreGetOptions>): Promise<undefined>
  getSubscriptions(): Promise<Array<CookieStoreGetOptions>>
  unsubscribe(subscriptions: Array<CookieStoreGetOptions>): Promise<undefined>
}

interface ServiceWorkerRegistration {
  readonly cookies: CookieStoreManager
}

interface CookieChangeEvent extends Event {
  readonly changed: ReadonlyArray<CookieListItem>
  readonly deleted: ReadonlyArray<CookieListItem>
}

declare var CookieChangeEvent: {
  new (type: string, eventInitDict?: CookieChangeEventInit): CookieChangeEvent
  prototype: CookieChangeEvent
}

interface CookieChangeEventInit extends EventInit {
  changed: CookieList
  deleted: CookieList
}

interface ExtendableCookieChangeEvent extends ExtendableEvent {
  readonly changed: ReadonlyArray<CookieListItem>
  readonly deleted: ReadonlyArray<CookieListItem>
}

declare var ExtendableCookieChangeEvent: {
  new (type: string, eventInitDict?: ExtendableCookieChangeEventInit): ExtendableCookieChangeEvent
  prototype: ExtendableCookieChangeEvent
}

interface ExtendableCookieChangeEventInit extends ExtendableEventInit {
  changed: CookieList
  deleted: CookieList
}

interface Window {
  readonly cookieStore: CookieStore
}

interface ServiceWorkerGlobalScope {
  readonly cookieStore: CookieStore

  oncookiechange: ((this: ServiceWorkerGlobalScope, ev: ExtendableCookieChangeEvent) => any) | null
}
