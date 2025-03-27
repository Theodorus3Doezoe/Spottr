import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//Components
import Header from './components/header/Header'

const router = createBrowserRouter([
  {path: "/", element: <>
    <Header/>
  </>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
