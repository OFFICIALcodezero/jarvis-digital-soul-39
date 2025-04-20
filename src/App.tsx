
import { useState } from "react";
import { Toaster } from "sonner";
import "./App.css";
import JarvisCore, { JarvisMode } from "./components/JarvisCore";
import JarvisAvatar from "./components/JarvisAvatar";
import JarvisChat from "./components/JarvisChat";
import JarvisControls from "./components/JarvisControls";
import JarvisStatusBar from "./components/JarvisStatusBar";
import JarvisApiSettings from "./components/JarvisApiSettings";
import { Brain, Mic, Headphones, Terminal } from "lucide-react";
import { useApiKeys } from "./hooks/useApiKeys";

function App() {
  const [activeMode, setActiveMode] = useState<JarvisMode>('normal');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiKeys, updateApiKeys } = useApiKeys();
  
  // Mode icons and names for the status bar
  const modeIcons = {
    normal: Brain,
    voice: Mic,
    face: Headphones,
    hacker: Terminal
  };
  
  const modeNames = {
    normal: 'Normal',
    voice: 'Voice',
    face: 'Face',
    hacker: 'Hacker'
  };

  return (
    <div className={`app-container ${activeMode === 'hacker' ? "hacker-mode" : ""}`}>
      <JarvisStatusBar 
        activeMode={activeMode}
        isSpeaking={isSpeaking}
        isListening={isListening}
        modeIcons={modeIcons}
        modeNames={modeNames}
      >
        <div className="flex items-center gap-2">
          <JarvisApiSettings />
        </div>
      </JarvisStatusBar>
      
      <main>
        <div className="jarvis-container">
          <JarvisAvatar 
            activeMode={activeMode} 
            isSpeaking={isSpeaking} 
          />
          <JarvisChat 
            activeMode={activeMode}
            setIsSpeaking={setIsSpeaking}
            isListening={isListening}
            apiKey={apiKeys.openAIKey}
            elevenLabsKey={apiKeys.elevenLabsKey}
          />
        </div>
        
        <JarvisControls 
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          isListening={isListening}
          setIsListening={setIsListening}
          apiKeys={apiKeys}
          updateApiKeys={updateApiKeys}
        />
      </main>
      
      <JarvisCore />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
