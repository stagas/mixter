import { Class, ContextFn, mixter, props, Root, shadow, state } from '.'

export const create = <P>(
  classOrFn: Class<P> | ContextFn<P & Root>,
  fn?: ContextFn<P & Root>,
) =>
  fn
    ? mixter(
      HTMLElement,
      shadow(),
      props(classOrFn as Class<P>),
      state(fn)
    )
    : mixter(HTMLElement, shadow(), state(classOrFn as ContextFn<Root>))
