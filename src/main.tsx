
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Index from './pages/Index.tsx'
import Startup from './pages/Startup.tsx'
import JarvisInterface from './pages/JarvisInterface.tsx'
import NotFound from './pages/NotFound.tsx'

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Startup />,
  },
  {
    path: '/interface',
    element: <JarvisInterface />,
  },
  {
    path: '/home',
    element: <Index />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
