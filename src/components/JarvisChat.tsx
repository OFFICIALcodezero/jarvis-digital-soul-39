
import React from "react";
import { JarvisChatProvider } from "./JarvisChatContext";
import JarvisSidebar from "./JarvisSidebar";
import JarvisChatMain from "./JarvisChatMain";
import JarvisImageOverlayHandler from "./JarvisImageOverlayHandler";
import HackerMode from "./chat/HackerMode";
import type { JarvisChatProps } from "@/types/chat";

const JarvisChat: React.FC<JarvisChatProps> = (props) => {
  // Render Hacker Mode directly
  if (props.activeMode === 'hacker') {
    return <HackerMode hackerOutput={""} setHackerOutput={_ => {}} />;
  }

  return (
    <JarvisChatProvider {...props}>
      <div className="jarvis-panel flex-1 flex flex-col h-full">
        <div className="p-3 bg-black/60 border-b border-jarvis/20">
          <h2 className="text-jarvis font-medium">
            {props.activeAssistant.toUpperCase()} Chat Interface
          </h2>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar/dashboard */}
          {props.activeMode === 'face' && (
            <div className="md:w-[320px] p-3 bg-black/30 border-r border-jarvis/20">
              {/* Put any face recognition or sidebar logic here */}
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
