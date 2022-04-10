import { Class, Mixin } from '../types'
import { accessors } from '../util'

export type ValueConstructor = typeof String | typeof Number | typeof Boolean

export type PropsType<T> = {
  [K in keyof T]: NonNullable<T[K]> extends ValueConstructor ? ReturnType<NonNullable<T[K]>> : NonNullable<T[K]>
}

const Types = new Map<ValueConstructor, (x: any) => any>([
  [String, x => x.toString()],
  [Number, x => parseFloat(x)],
  [Boolean, x => (x = x === false ? false : x != null)],
])

const applyProps = <T extends object>(
  self: any,
  data: Partial<T>,
) => {
  for (const [key, value] of Object.entries(data) as [keyof T, any][])
    if ([String, Number, Boolean].includes(value)) data[key] = void 0
  accessors(self, data, <K extends keyof T>(key: K extends string ? K : never) => {
    const attr = key.toLowerCase()
    return {
      get: () => data[key],
      set(value: T[K]) {
        self.setAttribute(attr, value)
      },
    }
  })
  return data
}

export const attrs = <P extends object>(attrs: Class<P>) =>
  <T extends Mixin>(superclass: T) => {
    const types = new Map()
    const map = new Map()
    for (const [key, value] of Object.entries(new attrs())) {
      const type = value == null
        ? Types.get(String)
        : Types.get(value) ?? Types.get(value?.constructor)
      if (!type) {
        throw new TypeError(
          `Attribute "${key}" is not valid type, must be either: String, Number, Boolean, null, undefined`
        )
      }
      types.set(key, type)
      map.set(key.toLowerCase(), key)
    }
    const observedAttributes = [...map.keys()]
    return class extends superclass {
      static get observedAttributes() {
        return observedAttributes.concat(super.observedAttributes ?? [])
      }
      #data: P
      constructor(...args: any[]) {
        super(...args)
        this.#data = applyProps(this, new attrs()) as P
      }
      propertyChangedCallback?<K extends keyof P>(
        name: K,
        oldValue: P[K] | null,
        newValue: P[K] | null,
      ): void
      attributeChangedCallback(this: any, name: string, oldValue: string | null, newValue: string | null) {
        let key
        if (key = map.get(name)) {
          const prev = this.#data[key]
          const next = types.get(key)(newValue)
          if (!Object.is(prev, next)) {
            this.#data[key] = next
            this.propertyChangedCallback?.(key, prev, next)
          }
        }
        super.attributeChangedCallback?.(name, oldValue, newValue)
      }
    } as unknown as T & Class<PropsType<P>>
  }
