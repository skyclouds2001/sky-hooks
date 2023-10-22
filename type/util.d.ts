/**
 * Make all properties in T writable
 */
type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}
