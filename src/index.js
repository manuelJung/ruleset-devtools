import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const MOUNT_NODE = document.getElementById('root')

const render = Container => ReactDOM.render(<Container />, MOUNT_NODE)

render(App)

// ========================================================
// HMR Setup
// ========================================================
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}