import { Class, Mixin } from '../types'

export interface EventHandler<T, E extends Event> {
  (e: E & { currentTarget: T; target: Element }): void
}

export type EventMap<T extends Mixin, P extends Record<string, Event>> = {
  [K in keyof P]: EventHandler<
    InstanceType<T>,
    P[K]
  >
}

export type InlineEventMap<T extends Mixin, P extends Record<string, Event>> = {
  [K in keyof P as `on${K extends string ? K : never}`]: EventHandler<
    InstanceType<T>,
    P[K]
  >
}

const Listener = (body: string) =>
  new Function(
    'event',
    `with(this){let fn=${body};return typeof fn=='function'?fn.call(this,event):fn}`
  )

export const events = <P extends Record<string, Event>>() =>
  <T extends Mixin>(superclass: T) =>
    (superclass.prototype.dispatch // only apply the mixin once
      ? superclass
      : class extends superclass {
        // based on: https://stackoverflow.com/a/49773201/175416
        dispatchEvent(event: Event) {
          const onEvent = `on${event.type}`
          let fn = (this as any)[onEvent]
          if (!fn) fn = Listener(this.getAttribute(onEvent)!)
          const pass = fn.call(this, event)
          if (pass !== false) super.dispatchEvent(event)
          return pass
        }
        dispatch(name: string, detail?: any, init?: CustomEventInit) {
          return this.dispatchEvent(new CustomEvent(name, { detail, ...init }))
        }
      }) as
        & T
        & Class<
          & {
            addEventListener<K extends keyof P>(type: K, listener: any, options?: any): void
            dispatch(name: string, detail?: any, init?: CustomEventInit): any
          }
          & InlineEventMap<T, P>
        >
