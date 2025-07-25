
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to ensure priority is properly typed
const validatePriority = (priority: string): 'high' | 'medium' | 'low' => {
  if (priority === 'high' || priority === 'medium' || priority === 'low') {
    return priority;
  }
  return 'medium'; // default fallback
};

// Helper function to convert database row to Note type
const mapDatabaseRowToNote = (row: any): Note => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  priority: validatePriority(row.priority),
  due_date: row.due_date,
  completed: row.completed,
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_id: row.user_id
});

export const useNotes = (user: User | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      console.log('Fetching notes for user:', user?.id);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }

      console.log('Fetched notes:', data);
      const typedNotes = (data || []).map(mapDatabaseRowToNote);
      setNotes(typedNotes);
    } catch (error) {
      console.error('Error in fetchNotes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    due_date?: string;
  }) => {
    try {
      console.log('Creating note:', noteData);
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user?.id,
          completed: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        throw error;
      }

      console.log('Created note:', data);
      const typedNote = mapDatabaseRowToNote(data);
      setNotes(prev => [typedNote, ...prev]);
      
      toast({
        title: "Success",
        description: "Note created successfully!"
      });

      return typedNote;
    } catch (error) {
      console.error('Error in createNote:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      console.log('Updating note:', id, updates);
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        throw error;
      }

      console.log('Updated note:', data);
      const typedNote = mapDatabaseRowToNote(data);
      setNotes(prev => prev.map(note => note.id === id ? typedNote : note));
      
      toast({
        title: "Success",
        description: "Note updated successfully!"
      });

      return typedNote;
    } catch (error) {
      console.error('Error in updateNote:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      console.log('Deleting note:', id);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }

      console.log('Deleted note:', id);
      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast({
        title: "Success",
        description: "Note deleted successfully!"
      });
    } catch (error) {
      console.error('Error in deleteNote:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleComplete = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    await updateNote(id, { completed: !note.completed });
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    toggleComplete,
    refetch: fetchNotes
  };
};
