
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import NotesManager from '@/components/NotesManager';
import PasswordVault from '@/components/PasswordVault';
import Profile from '@/components/Profile';
import Login from '@/components/Login';

const Index = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
  };

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin} 
        onToggleMode={toggleAuthMode}
        isSignup={isSignup}
      />
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'notes':
        return <NotesManager />;
      case 'passwords':
        return <PasswordVault />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Index;
