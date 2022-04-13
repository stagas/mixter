export { fromElement as element } from 'html-vdom/from-element'
export type { Component } from 'html-vdom/from-element'
export * from './refs'
import type { Context, Fx } from '../mixins/state'
import { Root } from '../types'
import { hook, render } from './jsx-runtime'
import { renderer } from './renderer'

export const jsx = <T extends Root>($: Context<T>['$']) => ({
  ...renderer(render)($),
  part(fn: Fx<T, JSX.Element>['fn'], output?: any) {
    let update: any
    const cb = (value: any) => {
      output = value
      update?.()
      return false
    }
    const Fn = () => {
      // lazily create effect when first used
      if (!update) $.effect(fn, cb)
      update = hook
      return output
    }
    return Fn
  },
})
