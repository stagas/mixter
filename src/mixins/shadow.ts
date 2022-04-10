import { Class, Mixin, Root } from '../types'

export const shadow = (init: ShadowRootInit | string = '', html = '') =>
  <T extends Mixin>(superclass: T) =>
    class extends superclass {
      readonly root = (() => {
        const root = this.attachShadow(typeof init === 'object' ? init : { mode: 'open' })
        root.innerHTML = typeof init === 'string' ? init : html
        return root
      })()
    } as T & Class<Root>
