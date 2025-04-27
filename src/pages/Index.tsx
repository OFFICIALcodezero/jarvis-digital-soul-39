
import React from 'react';
import WorldDashboard from '../components/WorldDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        World Time & Weather
      </h1>
      <WorldDashboard />
    </div>
  );
};

export default Index;
