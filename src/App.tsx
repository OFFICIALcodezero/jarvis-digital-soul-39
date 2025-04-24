import React from 'react';
import ArcReactorBackground from './components/background/ArcReactorBackground';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import NotFound from "./pages/NotFound";
import ImageGeneration from "./pages/ImageGeneration";

function App() {
  return (
    <div className="relative min-h-screen">
      <ArcReactorBackground />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/startup" />} />
          <Route path="/startup" element={<Startup />} />
          <Route path="/interface" element={<JarvisInterface />} />
          <Route path="/images" element={<ImageGeneration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
