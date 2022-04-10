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
    const Fn = () => {
      update = hook
      return output
    }
    $.effect(fn, value => {
      output = value
      update?.()
      return false
    })
    return Fn
  },
})
