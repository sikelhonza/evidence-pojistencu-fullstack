import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#ff6b2b',
              secondary: '#000',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)