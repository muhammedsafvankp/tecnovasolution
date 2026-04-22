import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SupabaseDataProvider } from './store/SupabaseDataStore.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseDataProvider>
      <App />
    </SupabaseDataProvider>
  </StrictMode>,
)
