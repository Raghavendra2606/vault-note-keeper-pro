
import React from 'react';
import { User } from '@supabase/supabase-js';
import { RefreshCw, Sparkles } from 'lucide-react';
import DashboardStats from './dashboard/DashboardStats';
import RecentNotes from './dashboard/RecentNotes';
import SecurityOverview from './dashboard/SecurityOverview';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { stats, recentNotes, loading, refetch } = useDashboardData(user);

  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-4 animate-shimmer"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="text-purple-500 animate-pulse" size={24} />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Welcome back, {user.email?.split('@')[0]}!
                </h1>
              </div>
              <p className="text-gray-600 text-sm md:text-base animate-fade-in" style={{animationDelay: '0.2s'}}>
                Here's what's happening with your notes and security.
              </p>
            </div>
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-300 hover:shadow-lg border-purple-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group"
            >
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
          <DashboardStats stats={stats} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <RecentNotes notes={recentNotes} />
          </div>
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <SecurityOverview savedPasswords={stats.savedPasswords} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
