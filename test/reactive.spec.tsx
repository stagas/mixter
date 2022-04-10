/** @jsxImportSource ../src/jsx */
import { mixter, props, shadow, state } from '../src'
import { jsx } from '../src/jsx'

let x = 0

describe('reactive', () => {
  it('works', () => {
    let result: any
    class Foo extends mixter(
      HTMLElement,
      shadow(),
      props(
        class {
          x = 1
          y = 2
          foo = 123
          add?: (x: number) => number
        }
      ),
      state<Foo>(({ $, effect, reduce }) => {
        const { render } = jsx($)
        $.add = reduce(({ y }) => x => x + y)
        $.foo = reduce(({ add, x }) => add(x))
        effect(({ foo }) => {
          result = foo
        })
        render(({ x, y, foo }) => <div>{x} + {y} = {foo}</div>)
      })
    ) {}

    customElements.define('x-foo' + ++x, Foo)
    const foo = new Foo()
    document.body.appendChild(foo)
    expect(result).toBe(3)
    foo.x = 5
    expect(result).toBe(7)
    foo.y = 10
    expect(result).toBe(15)
    expect(foo.root!.innerHTML).toBe('<div>5 + 10 = 15</div>')
  })
})
