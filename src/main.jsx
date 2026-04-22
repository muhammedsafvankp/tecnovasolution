import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MockDataProvider } from './store/MockDataStore.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MockDataProvider>
      <App />
    </MockDataProvider>
  </StrictMode>,
)
