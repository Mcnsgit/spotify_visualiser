import { auth } from './sync'
import Template from './template.jsx/index.js'
import Example from './example.jsx'

if (window.location.hash === '#start') {
  // const template = new Template()
  const example = new Example()
} else {
  auth()
}