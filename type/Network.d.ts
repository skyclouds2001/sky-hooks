interface Navigator extends NavigatorNetworkInformation {}

interface WorkerNavigator extends NavigatorNetworkInformation {}

interface NavigatorNetworkInformation {
  readonly connection: NetworkInformation
}

interface NetworkInformation extends EventTarget {
  readonly downlink: number
  readonly effectiveType: EffectiveConnectionType
  readonly rtt: number
  readonly saveData: boolean
  readonly type: ConnectionType
  readonly downlinkMax: number
  onchange: ((this: NetworkInformation, ev: Event) => any) | null
  addEventListener: <K extends keyof NetworkInformationEventMap>(type: K, listener: (this: NetworkInformation, ev: NetworkInformationEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof NetworkInformationEventMap>(type: K, listener: (this: NetworkInformation, ev: NetworkInformationEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var NetworkInformation: {
  prototype: NetworkInformation
}

interface NetworkInformationEventMap {
  change: Event
}

type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'

type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g'
