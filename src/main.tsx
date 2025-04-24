
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { JarvisInterface } from './pages/JarvisInterface'
import { NotFound } from './pages/NotFound'
import { Index } from './pages/Index'
import { Startup } from './pages/Startup'
import { ImageGeneration } from './pages/ImageGeneration'
import JarvisChatProvider from './contexts/JarvisChatProvider'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: '/startup',
    element: <Startup />,
  },
  {
    path: '/interface',
    element: <JarvisInterface />,
  },
  {
    path: '/image-generation',
    element: <ImageGeneration />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <JarvisChatProvider>
      <RouterProvider router={router} />
      <Toaster />
    </JarvisChatProvider>
  </React.StrictMode>,
)
