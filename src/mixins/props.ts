import { Class, Mixin } from '../types'

export const props = <P>(props: Class<P>) =>
  <T extends Mixin>(superclass: T) =>
    class extends superclass {
      constructor(...args: any[]) {
        super(...args)
        Object.defineProperties(
          this,
          Object.fromEntries(
            Object.entries(new props()).map(([key, value]) => [
              key,
              {
                configurable: true,
                enumerable: true,
                value,
              },
            ])
          )
        )
      }
    } as T & Class<P>
