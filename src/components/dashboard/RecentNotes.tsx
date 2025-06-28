
import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Note {
  id: string;
  title: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

interface RecentNotesProps {
  notes: Note[];
}

const RecentNotes = ({ notes }: RecentNotesProps) => {
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
        return 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-200';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg md:text-xl flex items-center space-x-2 text-gray-800">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Recent Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div 
                key={note.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-fade-in border border-gray-100 group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(note.priority)} shadow-lg group-hover:scale-110 transition-transform duration-300`} />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm md:text-base truncate block text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {note.title}
                    </span>
                    {note.completed && (
                      <div className="flex items-center text-green-600 text-xs mt-1 animate-fade-in">
                        <CheckCircle className="w-3 h-3 mr-1 animate-pulse" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs md:text-sm text-gray-500 flex-shrink-0 group-hover:text-gray-600 transition-colors duration-300">
                    {formatDueDate(note.due_date)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 animate-fade-in">
              <div className="relative">
                <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              </div>
              <p className="text-sm md:text-base font-medium text-gray-600 mb-2">No notes yet</p>
              <p className="text-xs text-gray-400">Create your first note to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotes;
