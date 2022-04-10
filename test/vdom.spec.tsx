/** @jsxImportSource ../src/jsx */
import { attrs, mixter, props, shadow, state } from '../src'
import { jsx, refs } from '../src/jsx'

let x = 0

describe('vdom', () => {
  it('render', async () => {
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      state<Foo>(function({ $ }) {
        const { render } = jsx($)
        render(() => <div>hello</div>)
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    // await Promise.resolve()
    expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
    expect(foo.root).toBeInstanceOf(ShadowRoot)
    expect(foo.root!.innerHTML).toBe('<div>hello</div>')
  })

  it('with refs', async () => {
    const results: any = []
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      props(
        class {
          div?: HTMLDivElement
        }
      ),
      state<Foo>(({ $, effect }) => {
        const { render } = jsx($)
        const { ref } = refs($)

        effect(({ div }) => {
          results.push(div.innerHTML)
        })
        render(() => <div ref={ref.div}>hello</div>)
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
    expect(foo.root).toBeInstanceOf(ShadowRoot)
    expect(foo.root!.innerHTML).toBe('<div>hello</div>')
    await Promise.resolve()
    expect(results).toEqual(['hello'])
  })

  it('reacts', async () => {
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      props(
        class {
          bar = 'world'
          foo?: string
        }
      ),
      state<Foo>(({ $ }) => {
        const { render } = jsx($)
        render(({ foo, bar }) => <div>{foo} {bar}</div>)
        $.foo = 'hello'
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    // await Promise.resolve()
    expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
    expect(foo.root).toBeInstanceOf(ShadowRoot)
    expect(foo.root!.innerHTML).toBe('<div>hello world</div>')
    foo.bar = 'there'
    // await Promise.resolve()
    expect(foo.root!.innerHTML).toBe('<div>hello there</div>')
  })

  it('part', async () => {
    let renderCount = 0
    let barCount = 0
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      attrs(
        class {
          zoo = String
        }
      ),
      props(
        class {
          bar = 'world'
          foo?: string
        }
      ),
      state<Foo>(({ $ }) => {
        const { part, render } = jsx($)
        const Bar = part(({ bar }) => {
          barCount++
          return bar
        })
        render(({ foo }) => {
          renderCount++
          return (
            <div>
              {foo} <Bar />
            </div>
          )
        })
        $.foo = 'hello'
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    // await Promise.resolve()

    expect(foo.shadowRoot).toBeInstanceOf(ShadowRoot)
    expect(foo.root).toBeInstanceOf(ShadowRoot)
    expect(foo.root!.innerHTML).toBe('<div>hello world</div>')
    expect(renderCount).toBe(1)
    expect(barCount).toBe(1)
    foo.bar = 'there'
    expect(renderCount).toBe(1)
    expect(barCount).toBe(2)
    expect(foo.root!.innerHTML).toBe('<div>hello there</div>')
  })
})
