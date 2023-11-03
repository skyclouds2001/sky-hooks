import { type DeepReadonly, type Ref } from 'vue'
import useMediaQuery from './useMediaQuery'

type Breakpoints<K extends string = string> = Record<K, number>

interface UseBreakpointsReturn<K extends string = string> {
  /**
   * passing breakpoints
   */
  breakpoints: Breakpoints<K>

  /**
   * whether current layout is greater then the passing value
   */
  greater: (k: K) => Ref<boolean>

  /**
   * whether current layout is greater or equal then the passing value
   */
  greaterOrEqual: (k: K) => Ref<boolean>

  /**
   * whether current layout is smaller then the passing value
   */
  smaller: (k: K) => Ref<boolean>

  /**
   * whether current layout is smaller or equal then the passing value
   */
  smallerOrEqual: (k: K) => Ref<boolean>

  /**
   * whether current layout is between the passing value
   */
  between: (a: K, b: K) => Ref<boolean>
}

/**
 * reactive breakpoints
 * @param breakpoints breakpoints presets
 * @returns @see {@link UseBreakpointsReturn}
 */
const useBreakpoints = <K extends string = string>(breakpoints: Breakpoints<K>): UseBreakpointsReturn<K> => {
  const greater = (k: K): DeepReadonly<Ref<boolean>> => useMediaQuery(`(min-width: ${breakpoints[k] + 0.001}px)`).matchMediaQuery

  const greaterOrEqual = (k: K): DeepReadonly<Ref<boolean>> => useMediaQuery(`(min-width: ${breakpoints[k] - 0.001}px)`).matchMediaQuery

  const smaller = (k: K): DeepReadonly<Ref<boolean>> => useMediaQuery(`(max-width: ${breakpoints[k] - 0.001}px)`).matchMediaQuery

  const smallerOrEqual = (k: K): DeepReadonly<Ref<boolean>> => useMediaQuery(`(max-width: ${breakpoints[k] + 0.001}px)`).matchMediaQuery

  const between = (a: K, b: K): DeepReadonly<Ref<boolean>> => useMediaQuery(`(min-width: ${breakpoints[a] - 0.001}px) and (max-width: ${breakpoints[b] + 0.001}px)`).matchMediaQuery

  return {
    breakpoints,
    greater,
    greaterOrEqual,
    smaller,
    smallerOrEqual,
    between,
  }
}

export default useBreakpoints

/**
 * Breakpoints from Ant Design
 * @see https://ant.design/components/layout/#breakpoint-width
 */
export const BreakpointsAntDesign = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const

/**
 * Breakpoints from Bootstrap V5
 * @see https://getbootstrap.com/docs/5.0/layout/breakpoints
 */
export const BreakpointsBootstrapV5 = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const

/**
 * Breakpoints from Master CSS
 * @see https://docs.master.co/css/breakpoints
 */
export const BreakpointsMasterCss = {
  '3xs': 360,
  '2xs': 480,
  xs: 600,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
  '2xl': 1600,
  '3xl': 1920,
  '4xl': 2560,
} as const

/**
 * Breakpoints from Quasar V2
 * @see https://quasar.dev/style/breakpoints
 */
export const BreakpointsQuasar = {
  xs: 600,
  sm: 1024,
  md: 1440,
  lg: 1920,
} as const

/**
 * Sematic Breakpoints
 */
export const BreakpointsSematic = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop4K: 2560,
} as const

/**
 * Breakpoints from Vuetify V2
 * @see https://vuetifyjs.com/en/features/breakpoints
 */
export const BreakpointsVuetify = {
  xs: 600,
  sm: 960,
  md: 1264,
  lg: 1904,
} as const

/**
 * Breakpoints from Tailwind V2
 * @see https://tailwindcss.com/docs/breakpoints
 */
export const BreakpointsTailwind = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
