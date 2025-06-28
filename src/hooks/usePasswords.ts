
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Password {
  id: string;
  site_name: string;
  username: string;
  encrypted_password: string;
  category?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const usePasswords = (user: User | null) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPasswords();
    }
  }, [user]);

  const fetchPasswords = async () => {
    try {
      console.log('Fetching passwords for user:', user?.id);
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching passwords:', error);
        throw error;
      }

      console.log('Fetched passwords:', data);
      setPasswords(data || []);
    } catch (error) {
      console.error('Error in fetchPasswords:', error);
      toast({
        title: "Error",
        description: "Failed to load passwords",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPassword = async (passwordData: {
    site_name: string;
    username: string;
    password: string;
    category?: string;
  }) => {
    try {
      console.log('Creating password:', { ...passwordData, password: '[HIDDEN]' });
      const { data, error } = await supabase
        .from('passwords')
        .insert({
          site_name: passwordData.site_name,
          username: passwordData.username,
          encrypted_password: passwordData.password, // In production, this should be encrypted
          category: passwordData.category,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating password:', error);
        throw error;
      }

      console.log('Created password:', { ...data, encrypted_password: '[HIDDEN]' });
      setPasswords(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Password saved successfully!"
      });

      return data;
    } catch (error) {
      console.error('Error in createPassword:', error);
      toast({
        title: "Error",
        description: "Failed to save password",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePassword = async (id: string, updates: Partial<Password>) => {
    try {
      console.log('Updating password:', id);
      const { data, error } = await supabase
        .from('passwords')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating password:', error);
        throw error;
      }

      console.log('Updated password:', { ...data, encrypted_password: '[HIDDEN]' });
      setPasswords(prev => prev.map(pwd => pwd.id === id ? data : pwd));
      
      toast({
        title: "Success",
        description: "Password updated successfully!"
      });

      return data;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePassword = async (id: string) => {
    try {
      console.log('Deleting password:', id);
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting password:', error);
        throw error;
      }

      console.log('Deleted password:', id);
      setPasswords(prev => prev.filter(pwd => pwd.id !== id));
      
      toast({
        title: "Success",
        description: "Password deleted successfully!"
      });
    } catch (error) {
      console.error('Error in deletePassword:', error);
      toast({
        title: "Error",
        description: "Failed to delete password",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    passwords,
    loading,
    createPassword,
    updatePassword,
    deletePassword,
    refetch: fetchPasswords
  };
};
