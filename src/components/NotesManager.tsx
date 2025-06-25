
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

const NotesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Mock data - will be replaced with Supabase data
  const [notes] = useState<Note[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal for the marketing team',
      priority: 'high',
      dueDate: '2024-01-15',
      completed: false,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, vegetables for the week',
      priority: 'medium',
      dueDate: '2024-01-12',
      completed: true,
      createdAt: '2024-01-09'
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      description: 'Regular checkup and cleaning',
      priority: 'low',
      completed: false,
      createdAt: '2024-01-08'
    }
  ]);

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
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || note.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Notes Manager</h1>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
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
                  <button className="text-gray-400 hover:text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(note.priority)}>
                  {note.priority.toUpperCase()}
                </Badge>
                {note.dueDate && (
                  <Badge variant="outline">
                    Due: {new Date(note.dueDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 mb-4 ${note.completed ? 'line-through' : ''}`}>
                {note.description}
              </p>
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600">
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
                  {new Date(note.createdAt).toLocaleDateString()}
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

      {/* Note: Modal for adding/editing notes will be implemented after Supabase integration */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Note</h2>
            <p className="text-gray-600 mb-4">
              Note creation will be enabled after Supabase integration.
            </p>
            <Button onClick={() => setShowModal(false)} variant="outline">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManager;
