
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

export const useDashboardData = (user: User) => {
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

  return { stats, recentNotes, loading };
};
