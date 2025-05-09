
import React from "react";
import JarvisDashboard from "@/components/JarvisDashboard";
import { JarvisChatProvider } from "@/contexts/JarvisChatProvider";

interface ChatDashboardPanelProps {
  messages?: any[];
  isTyping?: boolean;
}

const ChatDashboardPanel: React.FC<ChatDashboardPanelProps> = ({ messages, isTyping }) => {
  // Creating a safe wrapper that conditionally renders JarvisDashboard
  // with error handling to prevent blank screens
  return (
    <div className="p-3 bg-black/20 border-b border-jarvis/20">
      <ErrorBoundaryWrapper>
        <JarvisDashboard />
      </ErrorBoundaryWrapper>
    </div>
  );
};

// Simple error boundary wrapper component to prevent the entire UI from crashing
const ErrorBoundaryWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Reset error state on component mount
    setHasError(false);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-black/30 rounded-md">
        <p className="text-amber-400">Dashboard component unavailable.</p>
      </div>
    );
  }

  // Try to render the dashboard, but catch errors if JarvisChat context is missing
  try {
    return (
      <JarvisChatProvider>
        {children}
      </JarvisChatProvider>
    );
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    setHasError(true);
    return (
      <div className="p-4 bg-black/30 rounded-md">
        <p className="text-amber-400">Dashboard component unavailable.</p>
      </div>
    );
  }
};

export default ChatDashboardPanel;
