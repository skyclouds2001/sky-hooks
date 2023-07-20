import { describe, expect, it } from 'vitest'
import { useFavicon } from '../src'
import { nextTick } from 'vue'

describe('useFavicon', () => {
  it('should be defined', () => {
    expect(useFavicon).toBeDefined()
  })

  it('should initial to be null without initial value', async () => {
    const favicon = useFavicon()
    expect(favicon.value).toBeNull()

    favicon.value = 'v1'
    await nextTick()
    expect(favicon.value).toBe('v1')
  })

  it('should initial to be initial value with initial value', async () => {
    const favicon = useFavicon('v1')
    expect(favicon.value).toBe('v1')

    favicon.value = 'v2'
    await nextTick()
    expect(favicon.value).toBe('v2')
  })
})
