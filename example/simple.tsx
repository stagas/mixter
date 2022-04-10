/** @jsxImportSource ../src/jsx */
import { create } from '../src'
import { jsx } from '../src/jsx'

export const App = create(({ $ }) => {
  const { render } = jsx($)
  render(() => <div>Hello, world!</div>)
})
