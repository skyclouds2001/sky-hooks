declare var EyeDropper: {
  prototype: EyeDropper
  new (): EyeDropper
}

interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>
}

interface ColorSelectionOptions {
  signal: AbortSignal
}

interface ColorSelectionResult {
  sRGBHex: string
}
