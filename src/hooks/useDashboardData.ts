
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalNotes: number;
  completedNotes: number;
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

export const useDashboardData = (user: User) => {
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    completedNotes: 0,
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
      console.log('User session:', await supabase.auth.getSession());
      
      // Fetch notes statistics with explicit user_id filter
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Error fetching notes:', notesError);
        console.error('Notes query details:', { user_id: user.id });
      } else {
        console.log('Successfully fetched notes:', notes);
      }

      // Fetch passwords count with explicit user_id filter
      const { data: passwords, error: passwordsError } = await supabase
        .from('passwords')
        .select('id')
        .eq('user_id', user.id);

      if (passwordsError) {
        console.error('Error fetching passwords:', passwordsError);
        console.error('Passwords query details:', { user_id: user.id });
      } else {
        console.log('Successfully fetched passwords:', passwords);
      }

      // Calculate stats
      const totalNotes = notes?.length || 0;
      const completedNotes = notes?.filter(note => note.completed).length || 0;
      const pendingTasks = totalNotes - completedNotes;
      const savedPasswords = passwords?.length || 0;

      console.log('Calculated stats:', { totalNotes, completedNotes, pendingTasks, savedPasswords });

      setStats({
        totalNotes,
        completedNotes,
        pendingTasks,
        savedPasswords
      });

      // Get recent notes (last 3)
      const sortedNotes = notes?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 3) || [];

      console.log('Recent notes:', sortedNotes);
      setRecentNotes(sortedNotes);

      // Force a re-render to ensure UI updates
      setTimeout(() => {
        console.log('Dashboard data fetch completed');
      }, 100);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, recentNotes, loading, refetch: fetchDashboardData };
};
