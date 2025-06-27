
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityOverviewProps {
  savedPasswords: number;
}

const SecurityOverview = ({ savedPasswords }: SecurityOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Account Security</span>
            <span className="text-green-600 font-medium">Secure</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
          </div>
          <div className="text-sm text-gray-600">
            Your account is protected with Supabase authentication.
          </div>
          {savedPasswords > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <Shield className="inline w-4 h-4 mr-1" />
              {savedPasswords} passwords safely stored
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityOverview;
