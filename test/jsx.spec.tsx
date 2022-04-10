/** @jsxImportSource ../src/jsx/mini */
import { mixter, shadow, state } from '../src'
import { jsx } from '../src/jsx/mini'

let x = 0

describe('jsx', () => {
  it('render', () => {
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      state<Foo>(({ $ }) => {
        const { render } = jsx($)
        render(() => <div>hello</div>)
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
    expect(foo.root).toBeInstanceOf(ShadowRoot)
    expect((foo.root as ShadowRoot)!.mode).toBe('open')
    expect(foo.root!.innerHTML).toBe('<div>hello</div>')
  })

  // it('reacts', () => {
  //   class Foo extends mixter(
  //     HTMLElement,
  //     shadow(),
  //     component((context: Context<Foo>) => {
  //       const { render, draft } = vdom(context(
  //         class {
  //           foo?: string
  //         }
  //       ))
  //       render(({ foo, bar }) => <div>{foo} {bar}</div>)
  //       draft.foo = 'hello'
  //     })
  //   ) {
  //     bar = 'world'
  //   }

  //   customElements.define('x-foo' + ++x, Foo)
  //   const foo = new Foo()
  //   document.body.appendChild(foo)
  //   expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
  //   expect(foo.root).toBeInstanceOf(ShadowRoot)
  //   expect(foo.root!.mode).toBe('open')
  //   expect(foo.root!.innerHTML).toBe('<div>hello world</div>')
  //   foo.bar = 'there'
  //   expect(foo.root!.innerHTML).toBe('<div>hello there</div>')
  // })

  // it('part', () => {
  //   let renderCount = 0
  //   let barCount = 0
  //   class Foo extends mixter(
  //     HTMLElement,
  //     attrs(
  //       class {
  //         zoo = String
  //       }
  //     ),
  //     shadow(),
  //     component((context: Context<Foo>) => {
  //       const { part, render, draft } = vdom(context(
  //         class {
  //           foo?: string
  //         }
  //       ))
  //       const Bar = part(({ bar }) => {
  //         barCount++
  //         return bar
  //       })
  //       render(({ foo }) => {
  //         renderCount++
  //         return (
  //           <div>
  //             {foo} <Bar />
  //           </div>
  //         )
  //       })
  //       draft.foo = 'hello'
  //     })
  //   ) {
  //     bar = 'world'
  //   }

  //   customElements.define('x-foo' + ++x, Foo)
  //   const foo = new Foo()
  //   document.body.appendChild(foo)
  //   expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
  //   expect(foo.root).toBeInstanceOf(ShadowRoot)
  //   expect(foo.root!.mode).toBe('open')
  //   expect(foo.root!.innerHTML).toBe('<div>hello world</div>')
  //   expect(renderCount).toBe(1)
  //   expect(barCount).toBe(1)
  //   foo.bar = 'there'
  //   expect(renderCount).toBe(1)
  //   expect(barCount).toBe(2)
  //   expect(foo.root!.innerHTML).toBe('<div>hello there</div>')
  // })
})
