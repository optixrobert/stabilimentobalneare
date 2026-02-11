import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EstablishmentProvider } from './context/EstablishmentContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EstablishmentProvider>
        <App />
      </EstablishmentProvider>
    </BrowserRouter>
  </StrictMode>,
)
