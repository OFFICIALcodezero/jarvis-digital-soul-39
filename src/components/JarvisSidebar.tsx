
import React from "react";
import ChatDashboardPanel from "./chat/ChatDashboardPanel";
import { useJarvisChatContext } from "./JarvisChatContext";

const JarvisSidebar: React.FC = () => {
  const { showDashboard } = useJarvisChatContext();
  if (!showDashboard) return null;
  return (
    <ChatDashboardPanel />
  );
};

export default JarvisSidebar;
