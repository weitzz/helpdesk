import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GlobalStyle from './style/GlobalStyle'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  rootElement
)
