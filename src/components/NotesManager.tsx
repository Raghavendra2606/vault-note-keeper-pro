
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, Circle, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '@/hooks/useNotes';
import { User } from '@supabase/supabase-js';

interface NotesManagerProps {
  user: User;
}

const NotesManager = ({ user }: NotesManagerProps) => {
  const { notes, loading, createNote, updateNote, deleteNote, toggleComplete } = useNotes(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    due_date: ''
  });

  const openModal = (note?: any) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        description: note.description || '',
        priority: note.priority,
        due_date: note.due_date || ''
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          due_date: formData.due_date || undefined
        });
      } else {
        await createNote({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          due_date: formData.due_date || undefined
        });
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.description && note.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterPriority === 'all' || note.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Notes Manager</h1>
          <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={20} className="mr-2" />
            Add Note
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className={`hover:shadow-lg transition-shadow ${note.completed ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className={`text-lg ${note.completed ? 'line-through text-gray-500' : ''}`}>
                  {note.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openModal(note)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(note.priority)}>
                  {note.priority.toUpperCase()}
                </Badge>
                {note.due_date && (
                  <Badge variant="outline">
                    Due: {new Date(note.due_date).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {note.description && (
                <p className={`text-gray-600 mb-4 ${note.completed ? 'line-through' : ''}`}>
                  {note.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => toggleComplete(note.id)}
                  className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600"
                >
                  {note.completed ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      <span>Mark as complete</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-gray-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-500">Try adjusting your search or create a new note.</p>
        </div>
      )}

      {/* Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter note description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingNote ? 'Update Note' : 'Create Note'}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManager;
