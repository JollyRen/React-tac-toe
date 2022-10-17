//react v18 style

import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import App from './App'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
