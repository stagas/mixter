import { on } from 'fluent-event'

export const observeNodes = (
  nodes: Node[] | null,
  observer: MutationObserver,
  options: MutationObserverInit,
) => nodes?.forEach(node => observer.observe(node, options))

export const nodesToText = (nodes: Node[] | null) =>
  nodes
    ?.map(node => {
      const text = node.textContent!
      return text.trim().length ? text : ''
    })
    .join('') ?? ''

export type Slotted = { nodes: Node[]; elements: Element[]; firstChild?: Element }

export const slotted = (slots: HTMLSlotElement[]): Slotted => ({
  get nodes() {
    return slots.map(slot => slot.assignedNodes()).flat(Infinity) as Node[]
  },
  get elements() {
    return slots.map(slot => slot.assignedElements()).flat(Infinity) as Element[]
  },
  get firstChild() {
    return this.elements[0]
  },
})

export const onSlotChange = <T extends ShadowRoot | HTMLSlotElement>(
  el: T,
  cb: (slotted: Slotted) => void,
  fn: (el: T) => HTMLSlotElement[] = el => [...el.querySelectorAll('slot')],
) => on()(el, 'slotchange', () => cb(slotted(fn(el))))

export const onTextChange = <T extends ShadowRoot | HTMLSlotElement>(
  el: T,
  cb: (text: string) => void,
  fn?: (el: T) => HTMLSlotElement[],
) => {
  let observer: MutationObserver

  const off = onSlotChange(el, ({ nodes }) => {
    observer?.disconnect()
    if (nodes.length) {
      observer = new MutationObserver(() => cb(nodesToText(nodes)))
      observeNodes(nodes, observer, { characterData: true })
      cb(nodesToText(nodes))
    }
  }, fn)

  return () => {
    observer?.disconnect()
    off()
  }
}
