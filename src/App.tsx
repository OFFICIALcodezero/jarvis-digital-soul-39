import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import NotFound from "./pages/NotFound";
import ImageGeneration from "./pages/ImageGeneration";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="jarvis-ui-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/startup" />} />
            <Route path="/startup" element={<Startup />} />
            <Route path="/interface" element={<JarvisInterface />} />
            <Route path="/images" element={<ImageGeneration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
