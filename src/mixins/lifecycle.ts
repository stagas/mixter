import { events, mixter } from '../'
import { Class, Mixin } from '../types'

export const lifecycle = () =>
  <T extends Mixin>(superclass: T) =>
    class extends mixter(
      superclass,
      events<{
        mounted: CustomEvent
        unmounted: CustomEvent
      }>()
    ) {
      isMounted = false
      connectedCallback() {
        super.connectedCallback?.()
        if (!this.isMounted) {
          this.isMounted = true
          this.dispatch('mounted')
        }
      }
      disconnectedCallback() {
        super.disconnectedCallback?.()
        queueMicrotask(() => {
          if (!this.isConnected) {
            this.isMounted = false
            this.dispatch('unmounted')
          }
        })
      }
    } as T & Class<{ isMounted?: boolean }>
