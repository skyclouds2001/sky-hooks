import { describe, expect, it } from 'vitest'
import { useTitle } from '../src'
import { nextTick } from 'vue'

describe('useFavicon', () => {
  it('should be defined', () => {
    expect(useTitle).toBeDefined()
  })

  it('should initial to be empty string without initial value', async () => {
    const title = useTitle()
    expect(title.value).toBe('')

    title.value = 'v1'
    await nextTick()
    expect(title.value).toBe('v1')
  })

  it('should initial to be initial value with initial value', async () => {
    const title = useTitle('v1')
    expect(title.value).toBe('v1')

    title.value = 'v2'
    await nextTick()
    expect(title.value).toBe('v2')
  })
})
