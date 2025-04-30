
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import ImageGeneration from "./pages/ImageGeneration";
import JarvisSettings from "./components/JarvisSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/startup" element={<Startup />} />
      <Route path="/interface" element={<JarvisInterface />} />
      <Route path="/image-generation" element={<ImageGeneration />} />
      <Route path="/settings" element={<JarvisSettings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
