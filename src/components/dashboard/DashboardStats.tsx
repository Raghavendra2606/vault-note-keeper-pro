
import React from 'react';
import { FileText, Lock, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsData {
  totalNotes: number;
  completedNotes: number;
  savedPasswords: number;
  pendingTasks: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      delay: '0s'
    },
    {
      title: 'Completed',
      value: stats.completedNotes,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      delay: '0.1s'
    },
    {
      title: 'Saved Passwords',
      value: stats.savedPasswords,
      icon: Lock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      delay: '0.2s'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
      delay: '0.3s'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            className={`transform hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer border-0 bg-gradient-to-br ${stat.bgColor} animate-fade-in relative overflow-hidden`}
            style={{animationDelay: stat.delay}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-800 transition-colors duration-300">
                    {stat.title}
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-300 origin-left`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12`}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <TrendingUp className="h-3 w-3 mr-1 group-hover:text-green-500 transition-colors duration-300" />
                <span className="group-hover:text-gray-700 transition-colors duration-300">Active</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
