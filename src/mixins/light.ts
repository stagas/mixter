import { Class, Mixin, Root } from '../types'

export const light = (html = '') =>
  <T extends Mixin>(superclass: T) =>
    class extends superclass {
      readonly root = (() => {
        const root = this
        root.innerHTML = html
        return root
      })()
    } as T & Class<Root>
