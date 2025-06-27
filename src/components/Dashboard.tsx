
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  user: User;
}

interface Stats {
  totalNotes: number;
  completedTasks: number;
  pendingTasks: number;
  savedPasswords: number;
}

interface Note {
  id: string;
  title: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    completedTasks: 0,
    pendingTasks: 0,
    savedPasswords: 0
  });
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data for user:', user.id);
      
      // Fetch notes statistics
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Error fetching notes:', notesError);
        throw notesError;
      }

      console.log('Fetched notes:', notes);

      // Fetch passwords count
      const { data: passwords, error: passwordsError } = await supabase
        .from('passwords')
        .select('id')
        .eq('user_id', user.id);

      if (passwordsError) {
        console.error('Error fetching passwords:', passwordsError);
        throw passwordsError;
      }

      console.log('Fetched passwords:', passwords);

      // Calculate stats
      const totalNotes = notes?.length || 0;
      const completedTasks = notes?.filter(note => note.completed).length || 0;
      const pendingTasks = totalNotes - completedTasks;
      const savedPasswords = passwords?.length || 0;

      console.log('Calculated stats:', { totalNotes, completedTasks, pendingTasks, savedPasswords });

      setStats({
        totalNotes,
        completedTasks,
        pendingTasks,
        savedPasswords
      });

      // Get recent notes (last 3)
      const sortedNotes = notes?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 3) || [];

      console.log('Recent notes:', sortedNotes);
      setRecentNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              Your personal notes
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalNotes > 0 ? Math.round((stats.completedTasks / stats.totalNotes) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks to complete
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Passwords</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.savedPasswords}</div>
            <p className="text-xs text-muted-foreground">
              All encrypted & secure
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(note.priority)}`} />
                      <div>
                        <span className="font-medium">{note.title}</span>
                        {note.completed && (
                          <div className="flex items-center text-green-600 text-xs mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDueDate(note.due_date)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No notes yet. Create your first note!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Account Security</span>
                <span className="text-green-600 font-medium">Secure</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="text-sm text-gray-600">
                Your account is protected with Supabase authentication.
              </div>
              {stats.savedPasswords > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  <Shield className="inline w-4 h-4 mr-1" />
                  {stats.savedPasswords} passwords safely stored
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
