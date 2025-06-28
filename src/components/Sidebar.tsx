
import React from 'react';
import { Home, FileText, Lock, User, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeTab, onTabChange, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'passwords', label: 'Password Vault', icon: Lock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <Shield 
              size={32} 
              className="text-blue-400 transition-all duration-300 group-hover:text-blue-300 group-hover:scale-110 group-hover:rotate-12" 
            />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg transition-all duration-300 group-hover:bg-blue-300/30"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VaultNotes
            </h1>
            <p className="text-slate-400 text-sm transition-colors duration-300 group-hover:text-slate-300">
              Your secure workspace
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 group relative overflow-hidden",
                "transform hover:scale-105 hover:shadow-lg",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700 hover:text-white"
              )}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
              )}
              <Icon 
                size={20} 
                className={cn(
                  "transition-all duration-300 relative z-10",
                  "group-hover:scale-110",
                  isActive ? "animate-pulse" : ""
                )} 
              />
              <span className="relative z-10 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white transition-all duration-300 group transform hover:scale-105"
        >
          <LogOut 
            size={20} 
            className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" 
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
