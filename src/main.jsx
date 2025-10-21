import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/routes.jsx'
import { ToastContainer } from 'react-toastify'
import GlobalProvider from './contexts/GlobalProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </GlobalProvider>
  </StrictMode>,
)
