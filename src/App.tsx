
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import ThreatDetection from "./pages/ThreatDetection";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/threat-detection" element={<ThreatDetection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
