
import React from 'react';
import { User } from '@supabase/supabase-js';
import DashboardStats from './dashboard/DashboardStats';
import RecentNotes from './dashboard/RecentNotes';
import SecurityOverview from './dashboard/SecurityOverview';
import { useDashboardData } from '@/hooks/useDashboardData';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { stats, recentNotes, loading } = useDashboardData(user);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your notes and security.</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentNotes notes={recentNotes} />
        <SecurityOverview savedPasswords={stats.savedPasswords} />
      </div>
    </div>
  );
};

export default Dashboard;
