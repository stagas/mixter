import type { Context, Fx } from '../mixins/state'
import { Root } from '../types'

declare namespace JSX {
  type Element = any
}

export const renderer = (render: any) =>
  <T extends Root>($: Context<T>['$']) => ({
    render(fn: Fx<T, JSX.Element>['fn']) {
      $.effect(fn, (result: any) => {
        render(result, $.root)
        return false
      })
    },
  })
