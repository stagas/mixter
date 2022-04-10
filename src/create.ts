import { Class, ContextFn, mixter, props as propsMixin, Root, shadow, state } from '.'

export const create = <P>(
  props: Class<P>,
  fn: ContextFn<P & Root>,
) =>
  mixter(
    HTMLElement,
    shadow(),
    propsMixin(props),
    state(fn)
  )
