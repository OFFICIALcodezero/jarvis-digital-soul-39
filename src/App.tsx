
import { useState } from "react";
import { Toaster } from "sonner";
import "./App.css";
import JarvisCore from "./components/JarvisCore";
import JarvisAvatar from "./components/JarvisAvatar";
import JarvisChat from "./components/JarvisChat";
import JarvisControls from "./components/JarvisControls";
import JarvisStatusBar from "./components/JarvisStatusBar";
import JarvisApiSettings from "./components/JarvisApiSettings";

function App() {
  const [isHackerMode, setHackerMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [responseText, setResponseText] = useState("");

  const handleSend = (msg: string) => {
    setMessage(msg);
    setIsProcessing(true);
    
    // Simulate response after processing
    setTimeout(() => {
      setResponseText(`I processed your message: "${msg}"`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className={`app-container ${isHackerMode ? "hacker-mode" : ""}`}>
      <JarvisStatusBar>
        <div className="flex items-center gap-2">
          <JarvisApiSettings />
        </div>
      </JarvisStatusBar>
      
      <main>
        <div className="jarvis-container">
          <JarvisAvatar isSpeaking={isSpeaking} isHackerMode={isHackerMode} />
          <JarvisChat 
            responseText={responseText} 
            isProcessing={isProcessing} 
            isHackerMode={isHackerMode} 
          />
        </div>
        
        <JarvisControls 
          onSend={handleSend} 
          isProcessing={isProcessing} 
          onToggleHackerMode={() => setHackerMode(!isHackerMode)} 
          isHackerMode={isHackerMode}
          onPlayback={() => setIsSpeaking(!isSpeaking)} 
          isSpeaking={isSpeaking} 
        />
      </main>
      
      <JarvisCore />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
