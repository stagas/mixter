import { App } from './simple'

customElements.define('x-app', App)

const app = new App()
document.body.appendChild(app)
