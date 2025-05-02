
import React from 'react';
import JarvisSidebar from '@/components/JarvisSidebar';
import AdminDashboard from '@/components/AdminDashboard';

const JarvisAdmin: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-jarvis-bg">
      <JarvisSidebar />
      <main className="flex-1">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default JarvisAdmin;
