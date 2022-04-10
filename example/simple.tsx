/** @jsxImportSource ../src/jsx */
import { create } from '../src'
import { jsx } from '../src/jsx'

export const App = create(
  class {
    who = 'world'
  },
  ({ $ }) => {
    const { render } = jsx($)
    render(({ who }) => <div>Hello, {who}!</div>)
  }
)
