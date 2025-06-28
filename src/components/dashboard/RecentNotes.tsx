
import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
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
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Recent Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(note.priority)}`} />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm md:text-base truncate block">{note.title}</span>
                    {note.completed && (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{formatDueDate(note.due_date)}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm md:text-base">No notes yet. Create your first note!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotes;
