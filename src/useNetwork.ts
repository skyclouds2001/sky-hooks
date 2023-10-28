import { reactive, readonly } from 'vue'
import { useEventListener } from '.'

interface UseNetworkReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * network information
   */
  connection: Readonly<Pick<NetworkInformation, 'downlink' | 'effectiveType' | 'rtt' | 'saveData' | 'type' | 'downlinkMax'>>
}

/**
 * reactive Network Information API
 * @returns @see {@link UseNetworkReturn}
 */
const useNetwork = (): UseNetworkReturn => {
  const isSupported = 'connection' in navigator

  const connection = reactive<Writable<Pick<NetworkInformation, 'downlink' | 'effectiveType' | 'rtt' | 'saveData' | 'type' | 'downlinkMax'>>>({
    downlink: 0,
    downlinkMax: 0,
    type: 'unknown',
    effectiveType: 'slow-2g',
    rtt: 0,
    saveData: false,
  })

  const updateNetworkInformation = (): void => {
    const { downlink, downlinkMax, type, effectiveType, rtt, saveData } = navigator.connection

    connection.downlink = downlink
    connection.downlinkMax = downlinkMax
    connection.type = type
    connection.effectiveType = effectiveType
    connection.rtt = rtt * 0.025
    connection.saveData = saveData
  }

  if (isSupported) {
    updateNetworkInformation()

    useEventListener<NetworkInformation, NetworkInformationEventMap, 'change'>(navigator.connection, 'change', () => {
      updateNetworkInformation()
    })
  }

  return {
    isSupported,
    connection: readonly(connection),
  }
}

export default useNetwork
