import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStorage } from '../src'

describe('useStorage', () => {
  const KEY = 'key'
  const VALUE = 'value'

  const store = new Map<string, string>()
  const get = vi.fn((key: string) => store.get(key) ?? null)
  const set = vi.fn((key: string, value: string) => store.set(key, value))
  const remove = vi.fn((key: string) => store.delete(key))
  const storage = {
    getItem: get,
    setItem: set,
    removeItem: remove,
  } as unknown as Storage

  afterEach(() => {
    store.clear()
    get.mockClear()
    set.mockClear()
    remove.mockClear()
  })

  it('should be defined', () => {
    expect(useStorage).toBeDefined()
  })

  it('should init with null if no initial value provided', () => {
    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toBeNull()
  })

  it('should init with initial value if no initial value provided', () => {
    const data = useStorage(KEY, {
      storage,
      initial: VALUE,
      prefix: false,
    })

    expect(data.value).toBe(VALUE)
  })

  it('should support set prefix', () => {
    const dpb = useStorage(KEY, {
      storage,
      initial: VALUE,
      prefix: true,
    })

    expect(dpb.value).toBe(VALUE)
    expect(get).toBeCalledWith(`shooks-${KEY}`)

    const dps = useStorage(KEY, {
      storage,
      initial: VALUE,
      prefix: 'prefix',
    })

    expect(dps.value).toBe(VALUE)
    expect(get).toBeCalledWith(`prefix-${KEY}`)
  })

  it('should support store number data', async () => {
    useStorage(KEY, {
      storage,
      initial: 10,
      prefix: false,
    })

    await nextTick()

    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toBe(10)
    expect(store.get(KEY)).toContain('number')

    data.value = 20

    await nextTick()

    expect(data.value).toBe(20)
    expect(store.get(KEY)).toContain('number')
  })

  it('should support store string data', async () => {
    useStorage(KEY, {
      storage,
      initial: 's',
      prefix: false,
    })

    await nextTick()

    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toBe('s')
    expect(store.get(KEY)).toContain('string')

    data.value = 'ss'

    await nextTick()

    expect(data.value).toBe('ss')
    expect(store.get(KEY)).toContain('string')
  })

  it('should support store boolean data', async () => {
    useStorage(KEY, {
      storage,
      initial: false,
      prefix: false,
    })

    await nextTick()

    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toBe(false)
    expect(store.get(KEY)).toContain('boolean')

    data.value = true

    await nextTick()

    expect(data.value).toBe(true)
    expect(store.get(KEY)).toContain('boolean')
  })

  it('should support not store null data', async () => {
    useStorage(KEY, {
      storage,
      initial: null,
      prefix: false,
    })

    await nextTick()

    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toBeNull()
    expect(store.get(KEY)).toBeUndefined()
  })

  it('should support store object data', async () => {
    useStorage(KEY, {
      storage,
      initial: { n: 1, s: 's', b: true, u: null, o: {} },
      prefix: false,
    })

    await nextTick()

    const data = useStorage(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value).toStrictEqual({ n: 1, s: 's', b: true, u: null, o: {} })
    expect(store.get(KEY)).toContain('object')

    data.value = {}

    await nextTick()

    expect(data.value).toStrictEqual({})
    expect(store.get(KEY)).toContain('object')
  })

  it('should support store date data', async () => {
    const date = new Date()

    useStorage<Date>(KEY, {
      storage,
      initial: date,
      prefix: false,
    })

    await nextTick()

    const data = useStorage<Date>(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value?.getTime()).toBe(date.getTime())
    expect(store.get(KEY)).toContain('date')

    const d = new Date()

    data.value = d

    await nextTick()

    expect(data.value?.getTime()).toBe(d.getTime())
    expect(store.get(KEY)).toContain('date')
  })

  it('should support store map data', async () => {
    const map = new Map<string, number | string>()
    map.set('s', 1)

    useStorage<Map<string, number | string>>(KEY, {
      storage,
      initial: map,
      prefix: false,
    })

    await nextTick()

    const data = useStorage<Map<string, number | string>>(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value?.size).toBe(1)
    expect(data.value?.get('s')).toBe(1)
    expect(store.get(KEY)).toContain('map')

    map.set('ss', 's')
    data.value = map

    await nextTick()

    expect(data.value?.size).toBe(2)
    expect(data.value?.get('ss')).toBe('s')
    expect(store.get(KEY)).toContain('map')
  })

  it('should support store set data', async () => {
    const set = new Set<number | string>()
    set.add('s')

    useStorage<Set<number | string>>(KEY, {
      storage,
      initial: set,
      prefix: false,
    })

    await nextTick()

    const data = useStorage<Set<number | string>>(KEY, {
      storage,
      prefix: false,
    })

    expect(data.value?.size).toBe(1)
    expect(data.value?.has('s')).toBe(true)
    expect(store.get(KEY)).toContain('set')

    set.add(1)
    data.value = set

    await nextTick()

    expect(data.value?.size).toBe(2)
    expect(data.value?.has(1)).toBe(true)
    expect(store.get(KEY)).toContain('set')
  })
})
