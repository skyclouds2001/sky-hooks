import { computed, readonly, ref, shallowReadonly, shallowRef, type ComputedRef, type DeepReadonly, type Ref, type ShallowRef } from 'vue'
import tryOnMounted from './tryOnMounted'
import tryOnUnmounted from './tryOnUnmounted'
import useEventListener from './useEventListener'

const useBluetooth = (): {
  isSupported: boolean
  isAvailable: DeepReadonly<Ref<boolean>>
  isConnected: ComputedRef<boolean>
  device: ShallowRef<BluetoothDevice | null>
  server: ShallowRef<BluetoothRemoteGATTServer | null>
  error: Readonly<ShallowRef<unknown>>
  requestDevice: () => Promise<void>
} => {
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

  useEventListener(
    navigator.bluetooth,
    'availabilitychanged',
    () => {
      void updateBluetoothAvailability()
    },
    {
      passive: true,
    }
  )

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
