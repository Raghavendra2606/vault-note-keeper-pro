
import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityOverviewProps {
  savedPasswords: number;
}

const SecurityOverview = ({ savedPasswords }: SecurityOverviewProps) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5"></div>
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Shield className="h-5 w-5 text-green-600 animate-pulse" />
          <span>Security Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Account Security</span>
            </div>
            <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full animate-pulse">
              Secure
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Security Level</span>
              <span className="text-sm text-green-600 font-semibold">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-lg animate-pulse relative"
                style={{width: '100%'}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 animate-fade-in">
            <div className="text-sm text-gray-600 mb-3 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Your account is protected with Supabase authentication.</span>
            </div>
            {savedPasswords > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg animate-fade-in">
                <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <Lock className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {savedPasswords} passwords safely stored
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityOverview;
