
import React, { useState } from 'react';
import { User, Mail, Key, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileProps {
  user: { email: string };
}

const Profile = ({ user }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" size={20} />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Premium User
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <span className="text-gray-600">January 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" size={20} />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                <Key size={16} className="mr-1" />
                Change
              </Button>
            </div>

            {showPasswordChange && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <Input
                  type="password"
                  placeholder="Current password"
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full"
                />
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Save size={16} className="mr-1" />
                    Update Password
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowPasswordChange(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Password changes will be enabled after Supabase integration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Notes Created</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passwords Stored</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Login</span>
                <span className="font-medium">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Created</span>
                <span className="font-medium">Jan 1, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates about your account</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-logout</h4>
                <p className="text-sm text-gray-500">Automatically sign out after inactivity</p>
              </div>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
