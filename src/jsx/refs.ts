import type { Context } from '../mixins/state'
import { Root } from '../types'

const proxy = (target: any) =>
  new Proxy(target, {
    get: (_, key) => ({
      get current() {
        return target[key]
      },
      set current(el) {
        target[key] = el
      },
    }),
  })

export type Ref<T> = { current: T }

export type Refs<T> = { [K in keyof T]-?: NonNullable<T[K]> extends Element ? Ref<T[K]> : never }

export const refs = <T extends Root>($: Context<T>['$']) => ({
  ref: Ref($),
})

export const Ref: <T>(state: T) => Refs<T> = state => proxy(state)
