import { attrs, events, mixter, props, shadow, state } from '../src'

let x = 0

describe('test', () => {
  describe('shadow', () => {
    it('adds shadowroot', () => {
      class Foo extends mixter(
        HTMLElement,
        shadow()
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
      expect(foo.root).toBeInstanceOf(ShadowRoot)
      expect((foo.root as ShadowRoot)!.mode).toBe('open')
    })

    it('can set mode', () => {
      class Foo extends mixter(
        HTMLElement,
        shadow({ mode: 'closed' })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      expect(foo.shadowRoot).toBe(null)
      expect(foo.root).toBeInstanceOf(ShadowRoot)
      expect((foo.root as ShadowRoot)!.mode).toBe('closed')
    })

    it('can set html', () => {
      class Foo extends mixter(
        HTMLElement,
        shadow('<div>hello</div>')
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      expect(foo.root).toBeInstanceOf(ShadowRoot)
      expect((foo.root as ShadowRoot)!.mode).toBe('open')
      expect(foo.root!.innerHTML).toBe('<div>hello</div>')
    })

    it('can set both init and html', () => {
      class Foo extends mixter(
        HTMLElement,
        shadow({ mode: 'closed' }, '<div>hello</div>')
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      expect(foo.shadowRoot).toBe(null)
      expect(foo.root).toBeInstanceOf(ShadowRoot)
      expect((foo.root as ShadowRoot)!.mode).toBe('closed')
      expect(foo.root!.innerHTML).toBe('<div>hello</div>')
    })
  })

  describe('props', () => {
    it('defines props', () => {
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            a = 1
            b = 2
          }
        )
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      expect(foo.a).toBe(1)
      expect(foo.b).toBe(2)
    })

    it('works with component', () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            a = 1
            b = 2
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ a }) => {
            results.push(a)
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      expect(foo.a).toBe(1)
      expect(foo.b).toBe(2)
      expect(results).toEqual([1])
      foo.a = 42
      expect(foo.a).toBe(42)
      expect(results).toEqual([1, 42])
    })
  })

  describe('attrs', () => {
    it('defines attributes', () => {
      class Foo extends mixter(
        HTMLElement,
        attrs(
          class {
            a = 1
            b = 2
          }
        )
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      expect(foo.a).toBe(1)
      expect(foo.b).toBe(2)
    })

    //   it('can be set using setAttribute', () => {
    //     const result: any = []
    //     class Foo extends mixter(
    //       HTMLElement,
    //       attrs(
    //         class {
    //           a = Number
    //           b = Boolean
    //           c = String
    //           d = String
    //         }
    //       ),
    //       props(
    //         class {
    //           e = false
    //         }
    //       ),
    //       state<Foo>(({ $, effect }) => {
    //         effect(({ d, e }) => {
    //           if (d === 'from attr') $.e = true
    //           result.push([d, e])
    //         })
    //         effect(({ a, b, c }) => {
    //           result.push([a, b, c])
    //           $.d = 'yeah'
    //         })
    //       })
    //     ) {}

    //     customElements.define('x-foo' + ++x, Foo)
    //     const foo = new Foo()
    //     document.body.appendChild(foo)

    //     expect(foo.a).toBe(undefined)
    //     foo.setAttribute('a', '42')
    //     expect(foo.a).toBe(42)

    //     expect(foo.b).toBe(undefined)
    //     foo.toggleAttribute('b')
    //     expect(foo.b).toBe(true)

    //     expect(foo.c).toBe(undefined)
    //     foo.setAttribute('c', 'hello')
    //     expect(foo.c).toBe('hello')

    //     expect(result).toEqual([[42, true, 'hello'], ['yeah', false]])
    //     expect(foo.d).toEqual('yeah')

    //     foo.d = 'yep'
    //     expect(foo.d).toEqual('yep')
    //     expect(result).toEqual([[42, true, 'hello'], ['yeah', false], ['yep', false]])

    //     foo.setAttribute('d', 'from attr')
    //     expect(foo.d).toEqual('from attr')
    //     expect(result).toEqual([
    //       [42, true, 'hello'],
    //       ['yeah', false],
    //       ['yep', false],
    //       ['from attr', false],
    //       ['from attr', true],
    //     ])
    //   })
  })

  describe('events', () => {
    it('defines events', () => {
      class Foo extends mixter(
        HTMLElement,
        events<{ foo: CustomEvent<{ bar: string }> }>()
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      const results: any = []
      // foo.addEventListener('foo', ({ detail }) => {
      //   e.currentTarget
      // })
      foo.onfoo = ({ detail: { bar } }) => results.push(bar)
      foo.dispatchEvent(new CustomEvent('foo', { detail: { bar: 'baz' } }))
      expect(results).toEqual(['baz'])
    })
  })
  // describe('flatten', () => {
  //   it('defines flatten properties', () => {
  //     class Foo extends mixter(
  //       HTMLElement,
  //       flatten(
  //         class {
  //           foo = {
  //             bar: 123,
  //           }
  //         }
  //       )
  //     ) {}

  //     customElements.define('x-foo' + ++x, Foo)
  //     const foo = new Foo()
  //     document.body.appendChild(foo)
  //     expect(foo.fooBar).toBe(123)
  //   })
  // })
  // it('works', () => {
  //   class Foo extends mixter(
  //     HTMLElement,
  //     events,
  //     shadow({ mode: 'open' }, /*html*/ `<div>lol</div>`),
  //     attrs(
  //       class {
  //         foo = 'foo'
  //         width = 123
  //         height = 343
  //       }
  //     ),
  //     props(
  //       class {
  //         internal = 123
  //         someOther = 5125
  //       }
  //     ),
  //     <T extends Mixin>(base: T) =>
  //       class extends base {
  //         lol = true
  //       },
  //     component(({ context }: Context<Foo>) => {
  //       const { effect } = context(
  //         class {
  //           count = 0
  //           width = 123
  //           height = 343
  //         }
  //       )

  //       effect(({ foo, someOther }, draft) => {
  //         console.log(foo, someOther)
  //         draft.count += 1
  //       })
  //     })
  //   ) {}

  //   const foo = new Foo()
  //   // foo.foo
  //   // foo.internal
  //   // foo.lol
  // })

  describe('reactive', () => {
    it('trigger immediately', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo = 'hello'
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ foo }) => {
            results.push(foo)
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      document.body.appendChild(new Foo())
      // await Promise.resolve()
      expect(results).toEqual(['hello'])
    })

    it('mutate on init', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo?: string
          }
        ),
        state<Foo>(({ $, effect }) => {
          effect(({ foo }) => {
            results.push(foo)
          })
          $.foo = 'hello'
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      // await Promise.resolve()
      expect(results).toEqual(['hello'])
    })

    // it('literal object state', async () => {
    //   const results: any = []
    //   class Foo extends mixter(
    //     HTMLElement,
    //     props({
    //       foo: 'hello',
    //     }),
    //     state({
    //     })
    //   ) {
    //     connectedCallback() {
    //       const { effect } = this.reactive
    //       effect(({ foo }) => {
    //         results.push(foo)
    //       })
    //     }
    //   }

    //   customElements.define('x-foo' + ++x, Foo)
    //   const foo = new Foo()
    //   document.body.appendChild(foo)
    //   // await Promise.resolve()
    //   expect(results).toEqual(['hello'])
    // })

    it('mutate from local', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo?: string
          }
        ),
        state<Foo>(({ $, effect }) => {
          effect(({ foo }) => {
            results.push(foo)
          })
          $.foo = 'hello'
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      document.body.appendChild(new Foo())
      // await Promise.resolve()

      expect(results).toEqual(['hello'])
    })

    it('no trigger when not filled', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo?: string
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ foo }) => {
            results.push(foo)
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      // await Promise.resolve()

      expect(results).toEqual([])
      foo.foo = 'yo'
      expect(results).toEqual(['yo'])
    })

    it('trigger on mutate', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo = 'hello'
            bar = 'world'
          }
        ),
        state<Foo>(({ $, effect }) => {
          effect(({ bar }) => {
            results.push(bar)
          })
          effect(({ foo }) => {
            results.push(foo)
            $.bar = 'there'
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      // await Promise.resolve()

      expect(results).toEqual(['world', 'hello', 'there'])
    })

    it('objects trigger on mutate', async () => {
      const results: any = []
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo?: any = null
            bar = 'world'
          }
        ),
        state<Foo>(({ $, effect }) => {
          effect(({ bar }) => {
            results.push(bar)
          })
          effect(({ foo }) => {
            results.push(foo)
            $.bar = 'there'
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      foo.foo = {}
      expect(results).toEqual(['world', foo.foo, 'there'])
    })

    // it('mutate deep', async () => {
    //   const results: any = []
    //   class Foo extends mixter(
    //     HTMLElement,
    //     props(
    //       class {
    //         foo = {
    //           a: 1,
    //         }
    //         bar = {
    //           b: 2,
    //         }
    //       }
    //     ),
    //     state<Foo>(({ $, effect }) => {
    //       effect(({ bar }) => {
    //         results.push(bar.b)
    //       })
    //       effect(({ foo }) => {
    //         results.push(foo.a)
    //         $.bar.b = 3
    //       })
    //     })
    //   ) {}

    //   customElements.define('x-foo' + ++x, Foo)
    //   const foo = new Foo()
    //   document.body.appendChild(foo)
    //   // await Promise.resolve()

    //   expect(results).toEqual([2, 1, 3])
    // })

    it('dispose on disconnect', async () => {
      const results: any = []
      let count = 0
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo = 'hello'
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ foo }) => {
            results.push(foo)
            return () => count++
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)

      expect(results).toEqual(['hello'])
      expect(count).toBe(0)
      foo.remove()
      await Promise.resolve()
      expect(count).toBe(1)
    })

    it('apply effect again when same value appears again after dispose', async () => {
      const results: any = []
      let count = 0
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo: string | null = 'hello'
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ foo }) => {
            results.push(foo)
            return () => count++
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)

      expect(results).toEqual(['hello'])
      expect(count).toBe(0)
      foo.foo = null
      expect(count).toBe(1)
      foo.foo = 'hello'
      expect(results).toEqual(['hello', 'hello'])
      expect(count).toBe(1)
    })

    it('reconnect retain local state', async () => {
      const results: any = []
      let count = 0
      class Foo extends mixter(
        HTMLElement,
        props(
          class {
            foo = ++count
          }
        ),
        state<Foo>(({ effect }) => {
          effect(({ foo }) => {
            results.push(foo)
            return () => ++count
          })
        })
      ) {}

      customElements.define('x-foo' + ++x, Foo)
      const foo = new Foo()
      document.body.appendChild(foo)
      expect(count).toBe(1)
      expect(results).toEqual([1])
      foo.remove()
      await Promise.resolve()

      expect(count).toBe(2)
      document.body.appendChild(foo)
      expect(count).toBe(2)
    })
  })

  // it('nested effects', async () => {
  //   const results: any = []
  //   class Foo extends mixter(
  //     HTMLElement,
  //     props(
  //       class {
  //         foo?: string | null
  //         bar?: string
  //       }
  //     ),
  //     state<Foo>(({ effect }) => {
  //       effect(({ foo }) => {
  //         results.push(foo)
  //         effect(({ bar }) => {
  //           results.push(bar)
  //         })
  //       })
  //     })
  //   ) {}

  //   customElements.define('x-foo' + ++x, Foo)
  //   const foo = new Foo()
  //   document.body.appendChild(foo)
  //   // await Promise.resolve()

  //   expect(results).toEqual([])
  //   foo.foo = 'hello'
  //   expect(results).toEqual(['hello'])
  //   foo.bar = 'world'
  //   expect(results).toEqual(['hello', 'world'])
  //   foo.foo = null
  //   foo.bar = 'yo'
  //   expect(results).toEqual(['hello', 'world'])
  //   foo.foo = 'ok'
  //   expect(results).toEqual(['hello', 'world', 'ok', 'yo'])
  // })

  it('without dependencies', async () => {
    let ran = 0
    let discarded = 0
    class Foo extends mixter(
      HTMLElement,
      state(({ effect }) => {
        effect(() => {
          ran++
          return () => discarded++
        })
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()

    expect(ran).toBe(0)
    document.body.appendChild(foo)
    expect(ran).toBe(1)
    expect(discarded).toBe(0)
    foo.remove()
    await Promise.resolve()
    expect(discarded).toBe(1)
  })
})
