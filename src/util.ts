export type Fn = (...args: any[]) => any

export type Obj = Record<string, any>

export class UnSupportedError extends Error {
  constructor(type: string, message?: string, options?: ErrorOptions) {
    super(message, options)

    this.type = type
  }

  public readonly type: string
}
