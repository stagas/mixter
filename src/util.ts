export const accessors = (target: any, source: any, fn: (key: any, value: any) => PropertyDescriptor) =>
  Object.defineProperties(
    target,
    Object.fromEntries(
      Object.entries(source)
        .map(
          ([key, value]) => {
            const next = fn(key, value) as any
            const prev = Object.getOwnPropertyDescriptor(target, key)
            if (prev && prev.get && prev.set) {
              const { get, set } = next
              next.get = () => (prev.get?.() ?? get())
              next.set = (v: any) => {
                prev.set?.(v)
                set(prev.get?.() ?? v)
              }
            }
            return [key, {
              configurable: true,
              enumerable: true,
              ...next,
            }]
          }
        )
    )
  )

export const kebab = (s: string) => s.replace(/[a-z](?=[A-Z])|[A-Z]+(?=[A-Z][a-z])/g, '$&-').toLowerCase()
