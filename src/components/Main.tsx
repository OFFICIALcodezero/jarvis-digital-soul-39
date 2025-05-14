
import React from 'react';
import JarvisModeSwitcher from './JarvisModeSwitcher';
import AuthStatus from './auth/AuthStatus';

const Main = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-4 flex justify-end">
        <AuthStatus />
      </div>
      <JarvisModeSwitcher />
    </div>
  );
};

export default Main;
