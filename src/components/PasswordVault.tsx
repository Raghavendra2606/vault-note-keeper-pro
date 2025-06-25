
import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Edit, Trash2, Shield, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Password {
  id: string;
  siteName: string;
  username: string;
  password: string;
  category?: string;
  createdAt: string;
}

const PasswordVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    siteName: '',
    username: '',
    password: '',
    category: ''
  });
  const { toast } = useToast();

  // Mock data - will be replaced with encrypted Supabase data
  const [passwords, setPasswords] = useState<Password[]>([
    {
      id: '1',
      siteName: 'Gmail',
      username: 'user@example.com',
      password: 'SecurePass123!',
      category: 'Email',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      siteName: 'GitHub',
      username: 'developer',
      password: 'MyGitHub2024#',
      category: 'Development',
      createdAt: '2024-01-09'
    },
    {
      id: '3',
      siteName: 'Netflix',
      username: 'streaming_user',
      password: 'WatchMovies456$',
      category: 'Entertainment',
      createdAt: '2024-01-08'
    }
  ]);

  const openModal = (password?: Password) => {
    if (password) {
      setEditingPassword(password);
      setFormData({
        siteName: password.siteName,
        username: password.username,
        password: password.password,
        category: password.category || ''
      });
    } else {
      setEditingPassword(null);
      setFormData({
        siteName: '',
        username: '',
        password: '',
        category: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPassword(null);
    setFormData({
      siteName: '',
      username: '',
      password: '',
      category: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.siteName.trim() || !formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingPassword) {
      // Update existing password
      setPasswords(prev => prev.map(pwd => 
        pwd.id === editingPassword.id 
          ? { ...pwd, ...formData, category: formData.category || undefined }
          : pwd
      ));
      toast({
        title: "Success",
        description: "Password updated successfully!"
      });
    } else {
      // Create new password
      const newPassword: Password = {
        id: Date.now().toString(),
        ...formData,
        category: formData.category || undefined,
        createdAt: new Date().toISOString()
      };
      setPasswords(prev => [newPassword, ...prev]);
      toast({
        title: "Success",
        description: "Password saved successfully!"
      });
    }
    
    closeModal();
  };

  const deletePassword = (id: string) => {
    setPasswords(prev => prev.filter(pwd => pwd.id !== id));
    toast({
      title: "Success",
      description: "Password deleted successfully!"
    });
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`
    });
  };

  const filteredPasswords = passwords.filter(password =>
    password.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (password.category && password.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryColor = (category?: string) => {
    const colors = {
      'Email': 'bg-blue-100 text-blue-800',
      'Development': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Social': 'bg-green-100 text-green-800',
      'Banking': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Password Vault</h1>
          <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={20} className="mr-2" />
            Add Password
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Security Notice</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Password encryption will be enabled after Supabase integration. Currently showing demo data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasswords.map((password) => (
          <Card key={password.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{password.siteName}</CardTitle>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openModal(password)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deletePassword(password.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {password.category && (
                <Badge className={getCategoryColor(password.category)}>
                  {password.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{password.username}</span>
                  <button
                    onClick={() => copyToClipboard(password.username, 'Username')}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Password</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-mono">
                    {visiblePasswords.has(password.id) 
                      ? password.password 
                      : '••••••••••••'
                    }
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(password.id)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    {visiblePasswords.has(password.id) ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(password.password, 'Password')}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-2 border-t">
                Added {new Date(password.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No passwords found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new password.</p>
        </div>
      )}

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingPassword ? 'Edit Password' : 'Add New Password'}
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
                  Site Name *
                </label>
                <Input
                  value={formData.siteName}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="e.g., Gmail, GitHub"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username/Email *
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username or email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Email">Email</option>
                  <option value="Development">Development</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Social">Social</option>
                  <option value="Banking">Banking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingPassword ? 'Update Password' : 'Save Password'}
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

export default PasswordVault;
