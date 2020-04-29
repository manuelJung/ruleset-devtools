import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'

const MOUNT_NODE = document.getElementById('root')

const render = Container => ReactDOM.render((
  <ErrorBoundary>
    <Container/>
  </ErrorBoundary>
), MOUNT_NODE)

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