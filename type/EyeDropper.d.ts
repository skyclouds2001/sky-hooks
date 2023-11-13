interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>
}

declare var EyeDropper: {
  prototype: EyeDropper
  new (): EyeDropper
}

interface ColorSelectionOptions {
  signal: AbortSignal
}

interface ColorSelectionResult {
  sRGBHex: string
}
