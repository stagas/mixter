import { renderer } from '../renderer'
import { render } from './jsx-runtime'

export const jsx = renderer(render)
