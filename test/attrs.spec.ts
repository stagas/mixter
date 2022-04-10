import { attrs, mixter } from '../src'

const create = (Ctor: CustomElementConstructor) => {
  const randTag = 'x-' + ((Math.random() * 10e6) | 0).toString(36)
  customElements.define(randTag, Ctor)
  return randTag
}

describe('withProps', () => {
  it('creates a base class that mixins a given props instance', () => {
    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          foo = String
          bar = String
        }
      )
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.foo).toBeUndefined()
    el.setAttribute('foo', 'some value')
    expect(el.foo).toEqual('some value')

    expect(el.bar).toBeUndefined()
    el.setAttribute('bar', 'some other value')
    expect(el.bar).toEqual('some other value')
  })

  it('fires propertyChangedCallback', () => {
    const propChangedResults: any[] = []

    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          fooFoo = String
          barBar = String
        }
      )
    ) {
      propertyChangedCallback(name: string, oldValue: any, newValue: any) {
        propChangedResults.push({ name, oldValue, newValue })
      }
    }

    create(Foo)

    const el = new Foo()

    expect(el.fooFoo).toBeUndefined()
    el.setAttribute('foofoo', 'some value')
    expect(el.fooFoo).toEqual('some value')
    el.fooFoo = 'another'
    expect(el.fooFoo).toEqual('another')
    el.fooFoo = 'another'

    expect(el.barBar).toBeUndefined()
    el.setAttribute('barbar', 'some other value')
    expect(el.barBar).toEqual('some other value')

    expect(propChangedResults).toMatchSnapshot()
  })

  it('keys are enumerable', () => {
    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          foo = String
          bar = String
        }
      )
    ) {}

    create(Foo)

    const el = new Foo()

    expect(Object.keys(el)).toEqual(['foo', 'bar'])
  })

  it('converts kebab-case attribute names to propCase camelCased ones', () => {
    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          fooFoo = String
          barBar = String
        }
      )
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.fooFoo).toBeUndefined()
    el.setAttribute('foofoo', 'some value')
    expect(el.fooFoo).toEqual('some value')

    expect(el.barBar).toBeUndefined()
    el.setAttribute('barbar', 'some other value')
    expect(el.barBar).toEqual('some other value')
  })

  it('works with inheritance', () => {
    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          foo = String
        }
      )
    ) {}

    class Bar extends mixter(
      Foo,
      attrs(
        class {
          bar = String
        }
      )
    ) {}

    create(Bar)

    const el = new Bar()

    expect(el.foo).toBeUndefined()
    el.setAttribute('foo', 'some value')
    expect(el.foo).toEqual('some value')

    expect(el.bar).toBeUndefined()
    el.setAttribute('bar', 'some other value')
    expect(el.bar).toEqual('some other value')
  })

  it('casts values to primitive types', () => {
    class Foo extends mixter(
      HTMLElement,
      attrs(
        class {
          string? = String
          number? = Number
          boolean = Boolean
          implicitString = 'string'
          implicitNumber = 123
          implicitBoolean = true
          // somethingElse? = new Uint8Array(1)
        }
      )
    ) {}

    create(Foo)

    const el = new Foo()

    expect(el.string).toBeUndefined()
    expect(el.number).toBeUndefined()
    expect(el.boolean).toBeUndefined()

    el.string = 123 as any
    expect(el.string).toBe('123')
    el.setAttribute('string', '456')
    expect(el.string).toBe('456')

    el.number = '123' as any
    expect(el.number).toBe(123)
    el.setAttribute('number', '456')
    expect(el.number).toBe(456)

    el.boolean = '' as any
    expect(el.boolean).toBe(true)
    el.setAttribute('boolean', '')
    expect(el.boolean).toBe(true)
    el.toggleAttribute('boolean')
    expect(el.boolean).toBe(false)

    expect(el.implicitString).toBe('string')
    expect(el.implicitNumber).toBe(123)
    expect(el.implicitBoolean).toBe(true)

    el.implicitString = 123 as any
    expect(el.implicitString).toBe('123')

    el.implicitNumber = '123' as any
    expect(el.implicitNumber).toBe(123)
    el.setAttribute('implicitnumber', '456')
    expect(el.implicitNumber).toBe(456)

    el.implicitBoolean = '' as any
    expect(el.implicitBoolean).toBe(true)
    el.setAttribute('implicitboolean', '')
    expect(el.implicitBoolean).toBe(true)
    el.toggleAttribute('implicitboolean')
    expect(el.implicitBoolean).toBe(false)

    // el.setAttribute('something-else', '123')
    // expect(el.somethingElse).toBeInstanceOf(Uint8Array)
  })

  // it('uses `schema` static props class property when detected', () => {
  //   class Foo extends withProperties(
  //     HTMLElement,
  //     class {
  //       static schema = {
  //         foo: '',
  //         bar: '',
  //       }
  //       foo = 'some default'
  //     }
  //   ) {}

  //   create(Foo)

  //   const el = new Foo()

  //   expect(el.foo).toEqual('some default')
  //   el.setAttribute('foo', 'some value')
  //   expect(el.foo).toEqual('some value')

  //   expect(el.bar).toBeUndefined()
  //   el.setAttribute('bar', 'some other value')
  //   expect(el.bar).toEqual('some other value')
  // })
})
