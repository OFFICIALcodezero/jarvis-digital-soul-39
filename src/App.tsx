
import { Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import "./App.css";

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/startup" element={<Startup />} />
          <Route path="/interface" element={<JarvisInterface />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  );
}
