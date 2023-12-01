export type StorageDataType = number | string | boolean | object | null | any

export type StorageDataTypeEnum = 'number' | 'string' | 'boolean' | 'object' | 'null' | 'map' | 'set' | 'date' | 'any'

export const getTypeString = <T extends StorageDataType>(data: T): StorageDataTypeEnum => {
  return data === null ? 'null' : data instanceof Set ? 'set' : data instanceof Map ? 'map' : data instanceof Date ? 'date' : typeof data === 'object' ? 'object' : typeof data === 'string' ? 'string' : typeof data === 'boolean' ? 'boolean' : !Number.isNaN(data) ? 'number' : 'any'
}

export const stringify = <T extends StorageDataType>(data: T): string => {
  const type = getTypeString(data)
  let val: string
  switch (type) {
    case 'object':
      val = JSON.stringify(data)
      break
    case 'map':
      val = JSON.stringify(Array.from((data as Map<any, any>).entries()))
      break
    case 'set':
      val = JSON.stringify(Array.from(data as Set<any>))
      break
    case 'date':
      val = (data as Date).toISOString()
      break
    case 'null':
      val = 'null'
      break
    case 'number':
    case 'boolean':
    case 'string':
    case 'any':
    default:
      val = String(data)
      break
  }
  return JSON.stringify({
    data: val,
    type,
  })
}

export const parse = <T extends StorageDataType>(data: string): T => {
  const val = JSON.parse(data) as Record<'data' | 'type', string>
  let res: any
  switch (val.type) {
    case 'number':
      res = Number(val.data)
      break
    case 'boolean':
      res = val.data === 'true'
      break
    case 'object':
      res = JSON.parse(val.data)
      break
    case 'map':
      res = new Map(JSON.parse(val.data))
      break
    case 'set':
      res = new Set(JSON.parse(val.data))
      break
    case 'date':
      res = new Date(val.data)
      break
    case 'null':
      res = null
      break
    case 'string':
    case 'any':
    default:
      res = val.data
      break
  }
  return res
}
