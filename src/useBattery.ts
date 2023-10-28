import { reactive, readonly } from 'vue'
import { useEventListener } from '.'

interface UseBatteryReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * Battery Status
   */
  battery: Readonly<Partial<BatteryManager>>
}

/**
 * reactive Battery Status API
 * @returns @see {@link UseBatteryReturn}
 */
const useBattery = (): UseBatteryReturn => {
  const isSupported = 'getBattery' in navigator

  const battery = reactive<Writable<Pick<BatteryManager, 'charging' | 'chargingTime' | 'dischargingTime' | 'level'>>>({
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 100,
  })

  const updateBatteryInfo = (batteryManager: BatteryManager): void => {
    battery.charging = batteryManager.charging
    battery.chargingTime = batteryManager.chargingTime
    battery.dischargingTime = batteryManager.dischargingTime
    battery.level = batteryManager.level * 100
  }

  if (isSupported) {
    void navigator.getBattery().then((batteryManager) => {
      updateBatteryInfo(batteryManager)

      useEventListener<BatteryManager, BatteryManagerEventMap, 'chargingchange'>(batteryManager, 'chargingchange', (e) => {
        updateBatteryInfo(e.target as BatteryManager)
      })

      useEventListener<BatteryManager, BatteryManagerEventMap, 'levelchange'>(batteryManager, 'levelchange', (e) => {
        updateBatteryInfo(e.target as BatteryManager)
      })

      useEventListener<BatteryManager, BatteryManagerEventMap, 'chargingtimechange'>(batteryManager, 'chargingtimechange', (e) => {
        updateBatteryInfo(e.target as BatteryManager)
      })

      useEventListener<BatteryManager, BatteryManagerEventMap, 'dischargingtimechange'>(batteryManager, 'dischargingtimechange', (e) => {
        updateBatteryInfo(e.target as BatteryManager)
      })
    })
  }

  return {
    isSupported,
    battery: readonly(battery),
  }
}

export default useBattery
