
import React from "react";
import { JarvisChatProvider } from "./JarvisChatContext";
import JarvisSidebar from "./JarvisSidebar";
import JarvisChatMain from "./JarvisChatMain";
import JarvisImageOverlayHandler from "./JarvisImageOverlayHandler";
import HackerMode from "./chat/HackerMode";
import type { JarvisChatProps } from "@/types/chat";

interface JarvisChatComponentProps {
  hackerMode?: boolean;
}

const JarvisChat: React.FC<JarvisChatProps> = (props) => {
  // Render Hacker Mode directly
  if (props.activeMode === 'hacker') {
    return <HackerMode hackerOutput={props.hackerOutput || ""} setHackerOutput={props.setHackerOutput || (() => {})} onDeactivate={props.onDeactivateHacker} />;
  }

  return (
    <JarvisChatProvider {...props}>
      <div className={`jarvis-panel flex-1 flex flex-col h-full ${props.hackerModeActive ? 'hacker-mode' : ''}`}>
        <div className={`p-3 ${props.hackerModeActive ? 'bg-black/80 border-red-500/20' : 'bg-black/60 border-jarvis/20'} border-b`}>
          <h2 className={`${props.hackerModeActive ? 'hacker-text' : 'text-jarvis'} font-medium`}>
            {props.activeAssistant.toUpperCase()} {props.hackerModeActive ? 'SECURE INTERFACE' : 'Chat Interface'}
          </h2>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar/dashboard */}
          {props.activeMode === 'face' && (
            <div className={`md:w-[320px] p-3 ${props.hackerModeActive ? 'bg-black/60 border-red-500/20' : 'bg-black/30 border-jarvis/20'} border-r`}>
              <JarvisSidebar />
            </div>
          )}
          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            <JarvisChatMain />
          </div>
        </div>
        <JarvisImageOverlayHandler />
      </div>
    </JarvisChatProvider>
  );
};

export default JarvisChat;
