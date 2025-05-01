
import React from "react";
import JarvisDashboard from "@/components/JarvisDashboard";

interface ChatDashboardPanelProps {
  messages?: any[];
  isTyping?: boolean;
}

const ChatDashboardPanel: React.FC<ChatDashboardPanelProps> = ({ messages, isTyping }) => (
  <div className="p-3 bg-black/20 border-b border-jarvis/20">
    <JarvisDashboard />
  </div>
);

export default ChatDashboardPanel;
