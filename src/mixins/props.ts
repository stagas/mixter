import { Class, Mixin } from '../types'

export const props = <P>(props: Class<P>) =>
  <T extends Mixin>(superclass: T) =>
    class extends superclass {
      constructor(...args: any[]) {
        super(...args)
        Object.assign(this, new props())
      }
    } as T & Class<P>
