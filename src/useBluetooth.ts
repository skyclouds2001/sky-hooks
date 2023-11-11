import { computed, readonly, ref, shallowReadonly, shallowRef, type ComputedRef, type DeepReadonly, type Ref, type ShallowRef } from 'vue'
import tryOnMounted from './tryOnMounted'
import tryOnUnmounted from './tryOnUnmounted'
import useEventListener from './useEventListener'

interface UseBluetoothReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * available status of bluetooth
   */
  isAvailable: DeepReadonly<Ref<boolean>>

  /**
   * connect status of bluetooth
   */
  isConnected: ComputedRef<boolean>

  /**
   * current connected bluetooth device
   */
  device: ShallowRef<BluetoothDevice | null>

  /**
   * current connected bluetooth server
   */
  server: ShallowRef<BluetoothRemoteGATTServer | null>

  /**
   * connect bluetooth device running error, if any
   */
  error: Readonly<ShallowRef<unknown>>

  /**
   * method to request the device
   */
  requestDevice: () => Promise<void>
}

/**
 * reactive Bluetooth API
 * @returns @see {@link UseBluetoothReturn}
 */
const useBluetooth = (): UseBluetoothReturn => {
  const isSupported = 'bluetooth' in navigator

  const isAvailable = ref(false)

  const isConnected = computed(() => server.value?.connected ?? false)

  const device = shallowRef<BluetoothDevice | null>(null)

  const server = shallowRef<BluetoothRemoteGATTServer | null>(null)

  const error = shallowRef<unknown>()

  const requestDevice = async (): Promise<void> => {
    if (!isSupported) return

    if (!isAvailable.value) return

    error.value = null

    try {
      device.value = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      })
    } catch (err) {
      error.value = err
    }
  }

  const updateBluetoothAvailability = async (): Promise<void> => {
    isAvailable.value = await navigator.bluetooth.getAvailability()
  }

  useEventListener(navigator.bluetooth, 'availabilitychanged', () => {
    void updateBluetoothAvailability()
  })

  tryOnMounted(async () => {
    await updateBluetoothAvailability()
    await device.value?.gatt?.connect()
  })

  tryOnUnmounted(() => {
    device.value?.gatt?.disconnect()
  })

  return {
    isSupported,
    isAvailable: readonly(isAvailable),
    isConnected,
    device,
    server,
    error: shallowReadonly(error),
    requestDevice,
  }
}

export default useBluetooth
