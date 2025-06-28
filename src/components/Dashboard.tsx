
import React from 'react';
import { User } from '@supabase/supabase-js';
import { RefreshCw } from 'lucide-react';
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
      <div className="p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Here's what's happening with your notes and security.</p>
          </div>
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <RecentNotes notes={recentNotes} />
        <SecurityOverview savedPasswords={stats.savedPasswords} />
      </div>
    </div>
  );
};

export default Dashboard;
