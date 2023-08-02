import { reactive, readonly } from 'vue'
import { useEventListener } from '.'

const useNetwork = (): {
  isSupported: boolean
  connection: Readonly<{
    downlink: number | null
    effectiveType: NetworkEffectiveType | null
    rtt: number | null
    saveData: boolean | null
    type: NetworkType | null
    downlinkMax: number | null
  }>
} => {
  const isSupported = 'connection' in navigator

  const connection = reactive<{
    downlink: number | null
    effectiveType: NetworkEffectiveType | null
    rtt: number | null
    saveData: boolean | null
    type: NetworkType | null
    downlinkMax: number | null
  }>({
    downlink: null,
    downlinkMax: null,
    type: null,
    effectiveType: null,
    rtt: null,
    saveData: null,
  })

  const updateNetworkInformation = (information: NetworkInformation): void => {
    connection.downlink = information.downlink
    connection.downlinkMax = information.downlinkMax
    connection.type = information.type
    connection.effectiveType = information.effectiveType
    connection.rtt = information.rtt * 0.025
    connection.saveData = information.saveData
  }

  if (isSupported) {
    const connection = navigator.connection

    updateNetworkInformation(connection)

    useEventListener<NetworkInformation, NetworkInformationEventMap, 'change'>(
      connection,
      'change',
      () => {
        updateNetworkInformation(connection)
      },
      {
        passive: true,
      }
    )
  }

  return {
    isSupported,
    connection: readonly(connection),
  }
}

export default useNetwork
