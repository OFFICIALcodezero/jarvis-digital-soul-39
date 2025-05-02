
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
import JarvisAdmin from "./pages/JarvisAdmin";

function App() {
  return (
    <ErrorBoundary>
      <JarvisChatProvider>
        <div className="app-container">
          <JarvisModeEnhancer>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/startup" element={<Startup />} />
              <Route path="/interface" element={<JarvisInterface />} />
              <Route path="/image-generation" element={<ImageGeneration />} />
              <Route path="/images" element={<ImageGeneration />} />
              <Route path="/settings" element={<JarvisSettings />} />
              <Route path="/admin" element={<JarvisAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </JarvisModeEnhancer>
        </div>
      </JarvisChatProvider>
    </ErrorBoundary>
  );
}

export default App;
