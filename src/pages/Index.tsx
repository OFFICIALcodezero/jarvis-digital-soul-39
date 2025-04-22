
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Index = () => {
  return (
    <div className="h-screen bg-[#001A33] bg-opacity-95 bg-circuit-pattern bg-cover bg-center bg-blend-overlay">
      <div className="absolute inset-0 bg-circuit-overlay"></div>
      <div className="relative z-10 h-full">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
