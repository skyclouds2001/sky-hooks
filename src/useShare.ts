import { toValue, type MaybeRefOrGetter } from 'vue'

interface UseShareReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * to share data
   */
  share: (data?: MaybeRefOrGetter<ShareData>) => Promise<void>

  /**
   * hide virtual keyboard
   */
  canShare: (data?: MaybeRefOrGetter<ShareData>) => boolean
}

/**
 * reactive Web Share API
 * @param defaults defaults data to share
 * @returns @see {@link UseShareReturn}
 */
const useShare = (defaults: MaybeRefOrGetter<ShareData> = {}): UseShareReturn => {
  const isSupported = 'share' in navigator && 'canShare' in navigator

  const share = async (data: MaybeRefOrGetter<ShareData> = {}): Promise<void> => {
    await navigator.share({ ...toValue(defaults), ...toValue(data) })
  }

  const canShare = (data: MaybeRefOrGetter<ShareData> = {}): boolean => {
    return navigator.canShare({ ...toValue(defaults), ...toValue(data) })
  }

  return {
    isSupported,
    share,
    canShare,
  }
}

export default useShare
