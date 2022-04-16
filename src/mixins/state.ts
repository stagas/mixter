import { argtor } from 'argtor'
import { on } from 'fluent-event'
import { Class, lifecycle, Mixin, mixter } from '..'
import { accessors } from '../util'

export type ContextFn<T> = (this: T, ctx: Context<T>) => void

export type Deps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type Fx<T, R> = {
  fn: (deps: Deps<T>) => R
  cb?: (value: R) => boolean | void
  dispose?: (() => void) | null
  type?: any
  initial?: any
  target?: keyof T
  keys?: Set<keyof T>
  values?: Deps<T>
  pass?: boolean
}

export type Context<T> = {
  $: Context<T> & T
  cleanup: () => void
  effect: (fn: (ctx: Deps<T>) => any, cb?: Fx<T, any>['cb']) => void
  reduce: <R>(fn: (ctx: Deps<T>) => R, initial?: R) => R
}

const create = <T>(target: T) => {
  const NO_DEPS = Symbol()
  const REDUCER = Symbol()

  const entries = Object.entries(target) as [keyof T, any][]
  const mem = Object.fromEntries(entries) as T

  const register = (f: Fx<T, any>) => {
    f.keys = argtor(f.fn) as Set<keyof T>
    f.keys.forEach(key => {
      const fx = effects.get(key)
      if (!fx) {
        console.warn('No effects for key:', key)
        return
      }
      fx.push(f)
    })
    !f.keys.size && effects.get(NO_DEPS).push(f)
    f.values = {} as Deps<T>
    return run(f)
  }

  const update = (f: Fx<T, any>) => {
    f.pass = !f.keys!.size
    for (const key of f.keys!) {
      const value = target[key]
      if (value == null) {
        f.pass = false
        return
      }
      if (!(Object.is(f.values![key], value))) {
        f.values![key] = value!
        f.pass = true
      }
    }
  }

  const run = (f: Fx<T, any>) => {
    update(f)
    f.dispose?.()
    if (!f.pass) {
      f.values = {} as Deps<T>
      return
    }

    const result = f.fn(f.values!)
    if (f.cb?.(result) === false) return

    if (f.target != null) {
      target[f.target!] = result
      return true
    } else {
      if (typeof result === 'function') {
        f.dispose = () => {
          result()
          f.dispose = null
        }
      }
    }
  }

  const context = { $: {} } as Context<T>
  const $ = context.$
  $.$ = $

  accessors(context.$, target, (key: keyof T) => ({
    get: () => mem[key],
    set(v) {
      if (v === REDUCER) {
        v = reducer.initial
        reducer.target = key
        // if value is filled first time then return and don't use initial
        if (register(reducer)) return
        if (v == null) return
      }
      target[key] = v
    },
  }))

  accessors(target, target, (key: keyof T) => ({
    get: () => mem[key],
    set(v) {
      if (!(Object.is(mem[key], v))) {
        mem[key] = v
        effects.get(key).forEach(run)
      }
    },
  }))

  let reducer: Fx<T, any>
  $.reduce = <R>(
    fn: (ctx: Deps<T>) => R,
    initial?: any,
  ): R => {
    reducer = { fn, initial }
    return REDUCER as unknown as R
  }

  $.effect = (
    fn: (ctx: Deps<T>) => any,
    cb?: (value: any) => any,
  ) => register({ fn, cb })

  let effects: any
  $.cleanup = () => {
    if (effects) {
      for (const fns of effects.values())
        fns.forEach((f: Fx<any, any>) => f.dispose?.())
    }
    effects = new Map([
      [NO_DEPS, []],
      ...entries.map(([key]) => [key, []]),
    ] as any)
  }

  $.cleanup()

  return $
}

export const state = <P>(fn: ContextFn<P>) =>
  <T extends Mixin>(superclass: T) =>
    class extends mixter(
      superclass,
      lifecycle()
    ) {
      host = this
      constructor(...args: any[]) {
        super(...args)
        const context = create(this)
        on()(this, 'mounted', () => fn.call(this as any, context as any))
        on()(this, 'unmounted', context.cleanup)
      }
    } as
      & T
      & Class<{
        /** @private */
        host: InstanceType<T>
        /** @private */
        isMounted?: boolean
      }>
