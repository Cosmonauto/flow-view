import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import initialState from './util/initialState'
import reducers from './reducers'
import staticProps from 'static-props'

class Canvas {
  constructor (containerId) {
    let container = null

    // Check that containerId is a string.
    if (typeof containerId !== 'string') {
      throw new TypeError('containerId must be a string', containerId)
    }

    // If we are in browser context, get the container or create it.
    if (typeof document !== 'undefined') {
      container = document.getcontainerById(containerId)

      if (container === null) {
        container = document.createcontainer('div')
        container.id = containerId
        document.body.appendChild(container)
      }
    }

    staticProps(this)({ container, containerId })
  }

  render (view) {
    const container = this.container

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    }

    let store = createStore(
      reducers,
      Object.assign(initialState, view),
      window.devToolsExtension && window.devToolsExtension()
    )

    render(
      <Provider store={store}>
        <App offset={offset} />
      </Provider>,
      container
    )
  }
}

export default Canvas
