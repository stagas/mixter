/** @jsxImportSource ../src/jsx */
import { attrs, css, event, events, mixter, props, shadow, state } from '../src'
import { jsx, refs } from '../src/jsx'

type Todo = {
  name: string
  done: boolean
}

export class TodoApp extends mixter(
  // Extend basic HTMLElement
  HTMLElement,
  // Attach ShadowRoot
  shadow(),
  // Declare the events we will be emitting, this allows for
  // `el.onsomeevent = fn` to be statically typed
  events<{
    done: CustomEvent<{ todo: Todo }>
  }>(),
  // Element attributes, can be String, Number, Boolean
  attrs(
    class {
      name = 'My todos!'
      background = '#446'
      todoColor = '#fff'
      doneColor = '#999'
    }
  ),
  // Declare properties, can be any type
  props(
    class {
      form?: HTMLFormElement
      textInput?: HTMLInputElement
      todos: Todo[] = [
        { name: 'create todo list', done: true },
        { name: 'wow todo list', done: false },
        { name: 'so much todo', done: false },
      ]
      onTodoCleanup?: () => void
      onTodoAdd?: () => void
      onTodoChange?: (todo: Todo) => (
        e: Event & { currentTarget: HTMLInputElement },
      ) => void
    }
  ),
  // Reactive state handler
  state<TodoApp>(({ $, effect, reduce }) => {
    // Use jsx, returns the render function which acts like a `reduce`
    // that instead renders on the root element.
    const { render } = jsx($)
    // Use refs, `ref.someElement` can now be passed to `ref=` attributes in JSX.
    // Refs are bidirectional, meaning if they already have a reference, passing them to
    // a JSX element will "give" that element by reference, instead of filling "from" it.
    const { ref } = refs($)

    $.onTodoAdd = reduce(({ textInput, todos }) => (event().prevent.stop(() => {
      $.todos = [...todos, { name: textInput.value, done: false }]
      textInput.value = ''
      textInput.focus()
      // initialized with a noop function otherwise the render() below will never "fire"
      // because we are in its dependencies and our dependency `textInput` is
      // assigned inside it.
    })), () => {})

    $.onTodoChange = reduce(({ host, todos }) => (todo => (e => {
      todo.done = e.currentTarget.checked
      $.todos = [...todos]
      if (todo.done) host.dispatch('done', { todo })
    })))

    $.onTodoCleanup = reduce(({ todos }) => (() => {
      $.todos = [...todos.filter(todo => !todo.done)]
    }), () => {})

    effect(({ todos }) => {
      if (todos.length > 0 && todos.filter(todo => !todo.done).length === 0)
        alert('All done! Congrats!')
    })

    render(({ name, background, doneColor, onTodoAdd, onTodoChange, onTodoCleanup, todoColor, todos }) => (
      <>
        <style>
          {css`
          width: 250px;
          padding: 10px;
          display: inline-flex;
          flex-flow: column nowrap;
          align-items: center;
          font-family: monospace;
          background: ${background};
          color: ${todoColor};
          .done {
            color: ${doneColor};
          }
          `()}
        </style>

        <h1>{name}</h1>

        <form
          onsubmit={onTodoAdd}
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
          }}
        >
          <div>
            <input ref={ref.textInput} type="text" autofocus />
            <button type="submit">Add</button>
          </div>

          <ol>
            {todos.map(todo => (
              <li class={todo.done ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onchange={onTodoChange(todo)}
                  />
                  {todo.done
                    ? <strike>{todo.name}</strike>
                    : todo.name}
                </label>
              </li>
            ))}
          </ol>

          {todos.some(todo => todo.done)
            && <button onclick={onTodoCleanup}>Cleanup</button>}
        </form>
      </>
    ))
  })
) {}

customElements.define('todo-app', TodoApp)

const todoApp = new TodoApp()

document.body.appendChild(todoApp)

todoApp.ondone = ({ detail: { todo } }) => {
  console.log('done', todo)
  // change background to a random hue every time we finish a todo
  todoApp.background = `hsl(${Math.random() * 360}, 30%, 20%)`
}
