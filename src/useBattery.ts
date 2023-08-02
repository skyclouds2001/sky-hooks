import { reactive, readonly } from 'vue'
import { useEventListener } from '.'

const useBattery = (): {
  isSupported: boolean
  battery: Readonly<Partial<BatteryManager>>
} => {
  const isSupported = 'getBattery' in navigator

  const battery = reactive<Partial<BatteryManager>>({
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

      useEventListener<BatteryManager, BatteryManagerEventMap, 'chargingchange'>(
        batteryManager,
        'chargingchange',
        (e) => {
          updateBatteryInfo(e.target as BatteryManager)
        },
        {
          passive: true,
        }
      )

      useEventListener<BatteryManager, BatteryManagerEventMap, 'levelchange'>(
        batteryManager,
        'levelchange',
        (e) => {
          updateBatteryInfo(e.target as BatteryManager)
        },
        {
          passive: true,
        }
      )

      useEventListener<BatteryManager, BatteryManagerEventMap, 'chargingtimechange'>(
        batteryManager,
        'chargingtimechange',
        (e) => {
          updateBatteryInfo(e.target as BatteryManager)
        },
        {
          passive: true,
        }
      )

      useEventListener<BatteryManager, BatteryManagerEventMap, 'dischargingtimechange'>(
        batteryManager,
        'dischargingtimechange',
        (e) => {
          updateBatteryInfo(e.target as BatteryManager)
        },
        {
          passive: true,
        }
      )
    })
  }

  return {
    battery: readonly(battery),
    isSupported,
  }
}

export default useBattery
