import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store, StoreContext } from './stores/store.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/Routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </StrictMode>,
)
