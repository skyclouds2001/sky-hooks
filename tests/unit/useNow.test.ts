import { useNow } from '@'
import { describe, expect, it } from 'vitest'

describe('useNow', () => {
  it('should be defined', () => {
    expect(useNow).toBeDefined()
  })

  it('should get current timestamp', () => {
    const now = useNow()

    expect(now.value.getTime()).toBeLessThanOrEqual(Date.now())
  })
})
