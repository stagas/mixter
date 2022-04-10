export type Class<T> = new(...args: any[]) => T

export type Ctor = new(...args: any[]) => unknown

export type Mixable<T extends Ctor> = {
  new(...args: any[]): InstanceType<T>
} & Omit<T, 'constructor'>

export type Mixin = Mixable<CustomElementConstructor>

/** @private */
export type CustomElementConstructor = Class<CustomElement> & {
  /**
   * The attribute keys in this list are observed by the DOM
   * and invoke {@link attributeChangedCallback} when they change.
   * @private
   */
  observedAttributes?: string[]
}

/** @private */
export interface CustomElement extends HTMLElement {
  /**
   * Callback that is invoked when one of the {@link withProperties} changes.
   *
   * @param name Name of attribute
   * @param oldValue Old value
   * @param newValue New value
   */
  attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void

  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   this.addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   */
  connectedCallback?(): void

  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   */
  disconnectedCallback?(): void
}

export type Root = {
  /** @private */
  root: ShadowRoot | HTMLElement
}
