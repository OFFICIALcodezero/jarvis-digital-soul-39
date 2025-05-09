
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import ImageGeneration from "./pages/ImageGeneration";
import JarvisSettings from "./components/JarvisSettings";
import JarvisModeEnhancer from './components/JarvisModeEnhancer';
import { JarvisChatProvider } from "./contexts/JarvisChatProvider";
import ErrorBoundary from './components/ErrorBoundary';
import FeaturesOverview from "./pages/FeaturesOverview";
import SatelliteSurveillancePage from "./pages/SatelliteSurveillance";
import OSINTSearch from "./pages/OSINTSearch";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <JarvisChatProvider>
          <div className="app-container">
            <JarvisModeEnhancer>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/startup" element={<Startup />} />
                <Route path="/interface" element={<JarvisInterface />} />
                <Route path="/jarvis" element={<JarvisInterface />} /> 
                <Route path="/image-generation" element={<ImageGeneration />} />
                <Route path="/images" element={<ImageGeneration />} />
                <Route path="/settings" element={<JarvisSettings />} />
                <Route path="/features" element={<FeaturesOverview />} />
                <Route path="/satellite" element={<SatelliteSurveillancePage />} />
                <Route path="/osint" element={<OSINTSearch />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </JarvisModeEnhancer>
          </div>
        </JarvisChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
