
import React from "react";
import ChatDashboardPanel from "./chat/ChatDashboardPanel";
import { useJarvisChat } from "./JarvisChatContext";

const JarvisSidebar: React.FC = () => {
  const { showDashboard } = useJarvisChat();
  if (!showDashboard) return null;
  return (
    <ChatDashboardPanel />
  );
};

export default JarvisSidebar;
