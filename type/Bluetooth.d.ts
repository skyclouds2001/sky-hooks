interface Navigator {
  readonly bluetooth: Bluetooth
}

interface Bluetooth extends EventTarget, CharacteristicEventHandlers, BluetoothDeviceEventHandlers, ServiceEventHandlers {
  readonly referringDevice?: BluetoothDevice
  getAvailability: () => Promise<boolean>
  getDevices: () => Promise<BluetoothDevice[]>
  requestDevice: (options?: RequestDeviceOptions) => Promise<BluetoothDevice>
  onavailabilitychanged: ((this: Bluetooth, ev: ValueEvent) => any) | null
  addEventListener: <K extends keyof BluetoothEventMap>(type: K, listener: (this: Bluetooth, ev: BluetoothEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof BluetoothEventMap>(type: K, listener: (this: Bluetooth, ev: BluetoothEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var Bluetooth: {
  prototype: Bluetooth
}

interface BluetoothEventMap extends CharacteristicEventHandlersEventMap, BluetoothDeviceEventHandlersEventMap, ServiceEventHandlersEventMap {
  availabilitychanged: ValueEvent
}

interface BluetoothDevice extends EventTarget, CharacteristicEventHandlers, BluetoothDeviceEventHandlers, ServiceEventHandlers {
  readonly id: string
  readonly name?: string
  readonly gatt: BluetoothRemoteGATTServer
  forget: () => Promise<void>
  readonly watchingAdvertisements: boolean
  watchAdvertisements: (options?: WatchAdvertisementsOptions) => Promise<void>
  addEventListener: <K extends keyof BluetoothDeviceEventMap>(type: K, listener: (this: BluetoothDevice, ev: BluetoothDeviceEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof BluetoothDeviceEventMap>(type: K, listener: (this: BluetoothDevice, ev: BluetoothDeviceEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var BluetoothDevice: {
  prototype: BluetoothDevice
}

interface BluetoothDeviceEventMap extends CharacteristicEventHandlersEventMap, BluetoothDeviceEventHandlersEventMap, ServiceEventHandlersEventMap {}

interface BluetoothRemoteGATTServer {
  readonly connected: boolean
  readonly device: BluetoothDevice
  connect: () => Promise<BluetoothRemoteGATTServer>
  disconnect: () => void
  getPrimaryService: (service: BluetoothServiceUUID) => Promise<BluetoothRemoteGATTService>
  getPrimaryServices: (service: BluetoothServiceUUID) => Promise<BluetoothRemoteGATTService[]>
}

declare var BluetoothRemoteGATTServer: {
  prototype: BluetoothRemoteGATTServer
}

interface BluetoothRemoteGATTService extends EventTarget, CharacteristicEventHandlers, ServiceEventHandlers {
  readonly device: BluetoothDevice
  readonly isPrimary: boolean
  readonly uuid: UUID
  getCharacteristic: (characteristic: BluetoothCharacteristicUUID) => Promise<BluetoothRemoteGATTCharacteristic>
  getCharacteristics: (characteristic?: BluetoothCharacteristicUUID) => Promise<BluetoothRemoteGATTCharacteristic[]>
  getIncludedService: (service: BluetoothServiceUUID) => Promise<BluetoothRemoteGATTService>
  getIncludedServices: (service?: BluetoothServiceUUID) => Promise<BluetoothRemoteGATTService[]>
}

declare var BluetoothRemoteGATTService: {
  prototype: BluetoothRemoteGATTService
}

interface BluetoothRemoteGATTServiceEventMap extends CharacteristicEventHandlersEventMap, ServiceEventHandlersEventMap {}

interface BluetoothRemoteGATTCharacteristic extends EventTarget, CharacteristicEventHandlers {
  readonly properties: BluetoothCharacteristicProperties
  readonly service: BluetoothRemoteGATTService
  readonly uuid: UUID
  readonly value?: DataView
  getDescriptor: (descriptor: BluetoothDescriptorUUID) => Promise<BluetoothRemoteGATTDescriptor>
  getDescriptors: (descriptor?: BluetoothDescriptorUUID) => Promise<BluetoothRemoteGATTDescriptor[]>
  readValue: () => Promise<DataView>
  writeValue: (value: BufferSource) => Promise<void>
  writeValueWithResponse: (value: BufferSource) => Promise<void>
  writeValueWithoutResponse: (value: BufferSource) => Promise<void>
  startNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>
  addEventListener: <K extends keyof BluetoothRemoteGATTCharacteristicEventMap>(type: K, listener: (this: BluetoothRemoteGATTCharacteristic, ev: BluetoothRemoteGATTCharacteristicEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
  removeEventListener: <K extends keyof BluetoothRemoteGATTCharacteristicEventMap>(type: K, listener: (this: BluetoothRemoteGATTCharacteristic, ev: BluetoothRemoteGATTCharacteristicEventMap[K]) => any, options?: boolean | EventListenerOptions) => void
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
}

declare var BluetoothRemoteGATTCharacteristic: {
  prototype: BluetoothRemoteGATTCharacteristic
}

interface BluetoothRemoteGATTCharacteristicEventMap extends CharacteristicEventHandlersEventMap {}

interface BluetoothCharacteristicProperties {
  readonly authenticatedSignedWrites: boolean
  readonly broadcast: boolean
  readonly indicate: boolean
  readonly notify: boolean
  readonly read: boolean
  readonly reliableWrite: boolean
  readonly writableAuxiliaries: boolean
  readonly write: boolean
  readonly writeWithoutResponse: boolean
}

declare var BluetoothCharacteristicProperties: {
  prototype: BluetoothCharacteristicProperties
}

interface BluetoothRemoteGATTDescriptor {
  readonly characteristic: BluetoothRemoteGATTCharacteristic
  readonly uuid: UUID
  readonly value?: DataView
  readValue: () => Promise<DataView>
  writeValue: (value: BufferSource) => Promise<void>
}

declare var BluetoothRemoteGATTDescriptor: {
  prototype: BluetoothRemoteGATTDescriptor
}

interface BluetoothUUID {
  canonicalUUID: (alias: string | number) => UUID
  getCharacteristic: (name: string | number) => UUID
  getDescriptor: (name: string | number) => UUID
  getService: (name: string | number) => UUID
}

declare var BluetoothUUID: {
  prototype: BluetoothUUID
}

interface ValueEvent extends Event {
  readonly value: any
}

declare var ValueEvent: {
  prototype: ValueEvent
  new (type: string, initDict?: ValueEventInit): ValueEvent
}

interface ValueEventInit extends EventInit {
  value?: any
}

interface BluetoothManufacturerDataMap {
  entries: IterableIterator<[number, DataView]>
  keys: IterableIterator<number>
  readonly size: number
  values: IterableIterator<DataView>
  forEach: (callbackfn: (currentValue: DataView, key: number, map: Map<number, DataView>) => void, thisArg?: any) => void
  get: (key: number) => DataView | undefined
  has: (key: number) => boolean
  [Symbol.iterator]: IterableIterator<[number, DataView]>
}

interface BluetoothServiceDataMap {
  entries: IterableIterator<[UUID, DataView]>
  keys: IterableIterator<UUID>
  readonly size: number
  values: IterableIterator<DataView>
  forEach: (callbackfn: (currentValue: DataView, key: UUID, map: Map<UUID, DataView>) => void, thisArg?: any) => void
  get: (key: UUID) => DataView | undefined
  has: (key: UUID) => boolean
  [Symbol.iterator]: IterableIterator<[UUID, DataView]>
}

interface BluetoothAdvertisingEvent extends Event {
  readonly device: BluetoothDevice
  readonly uuids: readonly UUID[]
  readonly name?: string
  readonly appearance?: number
  readonly txPower?: number
  readonly rssi?: number
  readonly manufacturerData: BluetoothManufacturerDataMap
  readonly serviceData: BluetoothServiceDataMap
}

declare var BluetoothAdvertisingEvent: {
  prototype: BluetoothAdvertisingEvent
  new (type: string, init: BluetoothAdvertisingEventInit): BluetoothAdvertisingEvent
}

interface BluetoothAdvertisingEventInit extends EventInit {
  device: BluetoothDevice
  uuids?: Array<string | number>
  name?: string
  appearance?: number
  txPower?: number
  rssi?: number
  manufacturerData?: BluetoothManufacturerDataMap
  serviceData?: BluetoothServiceDataMap
}

interface RequestDeviceOptions {
  filters?: BluetoothLEScanFilterInit[]
  exclusionFilters?: BluetoothLEScanFilterInit[]
  optionalServices?: string[]
  optionalManufacturerData?: string[]
  acceptAllDevices?: boolean
}

interface BluetoothLEScanFilterInit {
  services: BluetoothServiceUUID[]
  name: string
  namePrefix: string
  manufacturerData: BluetoothManufacturerDataFilterInit
  serviceData: BluetoothServiceDataFilterInit
}

interface BluetoothDataFilterInit {
  dataPrefix: BufferSource
  mask: BufferSource
}

interface BluetoothManufacturerDataFilterInit extends BluetoothDataFilterInit {
  companyIdentifier: number
}

interface BluetoothServiceDataFilterInit extends BluetoothDataFilterInit {
  service: BluetoothServiceUUID
}

interface WatchAdvertisementsOptions {
  signal?: AbortSignal
}

interface CharacteristicEventHandlers {
  oncharacteristicvaluechanged: ((this: CharacteristicEventHandlers, ev: Event) => any) | null
}

interface CharacteristicEventHandlersEventMap {
  characteristicvaluechanged: Event
}

interface BluetoothDeviceEventHandlers {
  onadvertisementreceived: ((this: BluetoothDeviceEventHandlers, ev: Event) => any) | null
  ongattserverdisconnected: ((this: BluetoothDeviceEventHandlers, ev: Event) => any) | null
}

interface BluetoothDeviceEventHandlersEventMap {
  advertisementreceived: BluetoothAdvertisingEvent
  gattserverdisconnected: Event
}

interface ServiceEventHandlers {
  onserviceadded: ((this: ServiceEventHandlers, ev: Event) => any) | null
  onservicechanged: ((this: ServiceEventHandlers, ev: Event) => any) | null
  onserviceremoved: ((this: ServiceEventHandlers, ev: Event) => any) | null
}

interface ServiceEventHandlersEventMap {
  serviceadded: Event
  servicechanged: Event
  serviceremoved: Event
}

type UUID = string

type BluetoothServiceUUID = string | number

type BluetoothCharacteristicUUID = string | number

type BluetoothDescriptorUUID = string | number
